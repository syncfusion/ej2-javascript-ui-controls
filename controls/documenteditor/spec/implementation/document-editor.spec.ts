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
    it('isXmlPaneTool', () => {
        console.log('isXmlPaneTool');
        editor = new DocumentEditor();
        editor.appendTo("#container");
        editor.isXmlPaneTool = null;
        expect(editor.isXmlPaneTool).toBe(null);
        editor.destroy();
        editor = new DocumentEditor();
        editor.isXmlPaneTool = false;
        editor.appendTo("#container");
        expect(editor.isXmlPaneTool).toBe(false);
        editor.destroy();
    });
    it('isXmlMapCC', () => {
        console.log('isXmlMapCC');
        editor = new DocumentEditor();
        editor.isXmlMapCC = null;
        editor.appendTo("#container");
        expect(editor.isXmlMapCC).toBe(null);
        editor.destroy();
        editor = new DocumentEditor();
        editor.isXmlMapCC = false;
        editor.appendTo("#container");
        expect(editor.isXmlMapCC).toBe(false);
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
const json: any = {
    "optimizeSfdt": false,
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 85.05000305175781,
                "rightMargin": 85.05000305175781,
                "topMargin": 113.4000015258789,
                "bottomMargin": 85.05000305175781,
                "headerDistance": 35.45000076293945,
                "footerDistance": 35.45000076293945,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "breakCode": "NewPage",
                "restartPageNumbering": true,
                "pageStartingNumber": 1,
                "endnoteNumberFormat": "LowerCaseRoman",
                "footNoteNumberFormat": "Arabic",
                "restartIndexForFootnotes": "DoNotRestart",
                "restartIndexForEndnotes": "DoNotRestart",
                "initialFootNoteNumber": 1,
                "initialEndNoteNumber": 1,
                "pageNumberStyle": "Arabic",
                "numberOfColumns": 1,
                "equalWidth": true,
                "lineBetweenColumns": false,
                "columns": []
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 453.6000061035156,
                                "deletePosition": 0,
                                "tabJustification": "Right",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 13,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 13,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 13,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 13,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dschinni"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 13,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 13,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " Gesellschaft mit beschränkter Haftung, "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 13,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 13,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Agrabah"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 453.6000061035156,
                                "deletePosition": 0,
                                "tabJustification": "Right",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 13,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 13,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 13,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 13,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anhang für das Geschäftsjahr"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 453.6000061035156,
                                "deletePosition": 0,
                                "tabJustification": "Right",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 13,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 13,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 13,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 13,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vom 1. Januar 2019 bis zum 31. Dezember 2019"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "color": "#000000FF",
                                "hasNoneStyle": false,
                                "lineStyle": "Single",
                                "lineWidth": 1.5,
                                "shadow": false,
                                "space": 1
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "lineSpacing": 0.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 453.6000061035156,
                                "deletePosition": 0,
                                "tabJustification": "Right",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontSize": 13,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 13,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 453.6000061035156,
                                "deletePosition": 0,
                                "tabJustification": "Right",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 13,
                        "underline": "Single",
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 13,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Allgemeine Hinweise"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vorliegende "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahresabschluss "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gemäß "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "§§ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "242 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ff. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "§§ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "264 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ff. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "HGB "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sowie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einschlägigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorschriften "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "GmbH-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesetzes "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aufgestellt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Es "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gelten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorschriften "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mittelgroße "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kap"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "italgesellschaften."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Darstellung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gewinn- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verlustrechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsjahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vom "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Januar "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2019 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "31. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dezember "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2019 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vom "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Umsatzkostenverfahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auf "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesamtkostenkostenverfahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "umgestellt, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "um "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bessere "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "V"
                        },
                        {
                            "characterFormat": {},
                            "commentCharacterType": 0,
                            "commentId": "e185d657-0876-427b-b6be-eb81086521a6"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ergleichbarkeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B",
                            "revisionIds": [
                                "388b53fc-8f0f-4b64-b5d0-0e9eb917b53a"
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "anderen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaften "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aladin "
                        },
                        {
                            "characterFormat": {},
                            "commentCharacterType": 1,
                            "commentId": "e185d657-0876-427b-b6be-eb81086521a6"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Konzern "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erzielen. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zur "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "besseren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vergleichbarkeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beiden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsjahre "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gewinn- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verlustrechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorjahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ebenfalls "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auf "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesamtkostenverfahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "umgestellt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlage "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dargestellt. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Registerinformationen "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Firma "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "D"
                        },
                        {
                            "characterFormat": {},
                            "commentCharacterType": 0,
                            "commentId": "f29ace6d-9032-4ab3-bfa7-93a373eba968"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "schinni"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "hello ",
                            "revisionIds": [
                                "100903d0-1bf3-4b56-8d27-550df4ea6ac3"
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B",
                            "revisionIds": [
                                "100903d0-1bf3-4b56-8d27-550df4ea6ac3"
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellsch"
                        },
                        {
                            "characterFormat": {},
                            "commentCharacterType": 1,
                            "commentId": "f29ace6d-9032-4ab3-bfa7-93a373eba968"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beschränkter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Haftung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sitz "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Agrabah"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Handelsregister "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Amtsgerichts "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Agrabah"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unter"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bilanzierungs- und Bewertungsmethoden"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aufstellung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahresabschlusses "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "waren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unverändert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nachfolgenden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bilanzierungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bewertungsmethoden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "maßgebend. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erworbene "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "immaterielle "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermögensgegenstände"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagevermögens "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "hello.   ",
                            "revisionIds": [
                                "e8a3761f-ee0a-4573-853a-fd5800f9f2d3"
                            ]
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungskosten, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vermindert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "um "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "planmäßige "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erworbene "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Firmenwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auf "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erinnerungswert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vollständig "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgeschrieben."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ADDED"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ADDED"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ADDED"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ADDED"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "---ADDED"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Das "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sachanlagevermögen"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " wird "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bzw. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wird, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "soweit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abnutzbar, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "um "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "planmäßige "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vermindert. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "In "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "selbst "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erstellten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "neben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Einzelkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "anteilige "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gemeinkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Fertigung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "veranlasste "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einbezogen."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Berechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ermittelt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "betriebsgewöhnliche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nutzungsdauer. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "linear "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vorgenommen. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagenzugänge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beweglichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sachanlagevermögens "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "linear "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgeschrieben."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geringwertige "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagegüter"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Netto-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Einzelwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "EUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "250,00 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zugangs "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aufwand "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erfasst "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "worden; "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ihr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sofortiger "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abgang "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unterstellt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagegüter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bzw. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zwischen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "EUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "250,00"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "EUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1.000,00, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ab "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Januar "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2008 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angeschafft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "untergeordneter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bedeutung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "jährlich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "steuerlich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bildende "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sammelposten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vereinfachungsgründen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Handelsbilanz "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "übernommen. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Diese "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "über "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nutzungsdauer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "5 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgeschrieben."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Das "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorratsvermögen"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " wird "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "oder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auf "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Basis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Standardkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Beachtung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Niederstwertprinzips "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bewertet. "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Roh-"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ", "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Hilfs- "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Betriebsstoffe"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "oder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "niedrigeren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Tageswerten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "am "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bilanzstichtag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bewer"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "tet."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unfertigen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erzeugnisse "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unfertigen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Leistungen"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "über "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Fertigungsaufträge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "per "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "31. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dezember 2019 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erfasst. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dabei "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "alle "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bewertung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "relevanten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "fertigen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erzeugnisse"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Herstellungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bewertet, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wobei "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "neben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "direkt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zurechenbaren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Materialeinzelkosten, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Fertigungslöhnen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sondereinzelkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Fertigungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Materialgemeinkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sowie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "allgemeinen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verwaltung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nicht "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aktiviert."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Wo "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zutreffend, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verlustfrei "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bewertet, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "d.h., "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "es "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "voraussichtlichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verkaufspreisen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschläge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "noch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "anfallende "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kosten"
                        },
                        {
                            "characterFormat": {
                                "italic": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vorgenommen."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Handelswaren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anschaffungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "oder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "niedrigeren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Marktpreisen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bilanziert."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Alle "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erkennbaren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Risiken "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorratsvermögen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "überdurchschnittlicher "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Lagerdauer, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "geminderter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verwertbarkeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "niedrigeren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Wiederbeschaffungskosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ergeben, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angemessene "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abwertungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verluste "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Liefer- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abnahmeverpflichtungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angemessener "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gebildet."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abgesehen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "handelsüblichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Eigentumsvorbehalten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorräte "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "frei "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rechten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dritt"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "er."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "\f"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Forderungen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstige "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermögensgegenstände"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nennwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Allen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "risikobehafteten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Posten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bildung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angemessener "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Einzelwertberichti-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gungen"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " Rechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "getragen; "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "allgemeine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kreditrisiko "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "pauschale "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschläge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Unverzinsliche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "oder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "niedrig "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verzinsliche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Forderungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Laufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mehr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgezinst."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " Guthaben "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bei "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kreditinstituten"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ihrem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nennwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bilanziert."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Als "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aktive "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rechnungsabgrenzungsposten"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Ausgaben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vor "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschlussstichtag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ausgewiesen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aufwand "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bestimmte "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "diesem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Tag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "darstellen."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Das "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Eigenkapital "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wird "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nennwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vollständig "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eingezahlt "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "_heading=h.gjdgxs",
                            "properties": {
                                "columnFirst": 0,
                                "columnLast": 0
                            }
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "_heading=h.gjdgxs"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Pensionen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ähnliche "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verpflichtungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "werden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sog. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Projected"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-Unit-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Credit"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-Methode "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(PUC-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Methode) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verwendung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\"Richttafeln "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2018 G\" "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Prof. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dr. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Klaus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Heubeck "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ermittelt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abzinsung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "pauschal "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "durchschnittliche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Marktzinssatz "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bei "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "restlichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Laufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "15 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2,71 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "3,21) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gemäß "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungsabzinsungsverordnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vom "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "18. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "November "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2009 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verwendet. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erwartete "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gehaltssteigerungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-1"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "0,0 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2,0 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "%) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erwartete "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rentensteigerungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1,5 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(1,5 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "%) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Fluktuation "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abhängigkeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Alter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschlecht "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Personen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "4 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "berücksichtigt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "0-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "4 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "%)."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ausschließlich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erfüllung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Altersversorgungsverpflichtungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dienenden, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zugriff "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aller "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "übrigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gläubiger "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "entzogenen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermögensgegenstände "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(Deckungsvermögen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "i.S.d"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "§ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "246 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abs. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Satz "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "HGB) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ihrem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beizulegenden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zeitwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verrechnet. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " berücksichtigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "alle "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ungewissen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verbindlichkeiten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "drohenden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verluste "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "schwebenden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäften. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "vernünftiger "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "kaufmännischer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Beurteilung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "notwendigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erfüllungsbetrags "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(d. h. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einschließlich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zukünftiger "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kosten- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Preissteigerungen) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Restlaufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mehr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgezinst. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Soweit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zugrunde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "liegende "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verpflichtung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zinsanteil "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "enthält "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "oder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rentenverpflichtung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ohne "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gegenleistung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "darstellt, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Barwert "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zinsfuß "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "0,68 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bzw. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1,96 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "0,95 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "% "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bzw. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2,32 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "%) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verbindlichkeiten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erfüllungsbetrag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gewinn- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verlustrechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ausgewiesenen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "davon-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermerke "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Währungsumrechnung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "enthalten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sowohl "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "realisierte "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "auch "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nicht "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "realisierte "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Währungskursdifferenzen."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erläuterungen zur Bilanz"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagevermögen"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Entwicklung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einzelnen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Posten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagevermögens "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "unter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Angabe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abschreibungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsjahres "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anlagenspiegel "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dargestellt."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Angaben zum Anteilsbesitz"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorjahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ausgewiesene "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Beteiligung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "10 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "an "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Pvt"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Ltd., "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Indien, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ist "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "abgegangen."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Forderungen und sonstige Vermögensgegenstände"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Forderungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermögensgegenständen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "haben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "368 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "370) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Restlaufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mehr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Forderungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gegen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verbundene "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Unternehmen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "16.948 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "18.612) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "resultieren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "16.392 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "16.654) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Cashpool"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-Forderungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sowie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Übrigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Lieferungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Leistungsverkehr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "haben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Restlaufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen für Pensionen und ähnliche Verpflichtungen"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Unterschiedsbetrag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "§ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "253 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Abs. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "6 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "HGB "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beträgt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "699 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "EUR 749). "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Angaben zur Verrechnung nach § 246 Abs. 2 Satz 2 HGB: "
                        }
                    ]
                },
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 345.3500061035156,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 345.35001230015589,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "TEUR"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.75,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 79.8499984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 79.84999990687541,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "Erfüllungsbetrag der verrechneten Schulden"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 345.3500061035156,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 345.35001230015589,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "7.341"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.75,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 79.8499984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 79.84999990687541,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "Beizulegender Zeitwert der Vermögensgegenstände"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 345.3500061035156,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 345.35001230015589,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "74"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 79.8499984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 79.84999990687541,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "Verrechnete Aufwendungen"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 345.3500061035156,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 345.35001230015589,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "128"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "0"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 79.8499984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 79.84999990687541,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "Verrechnete Erträge"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 345.3500061035156,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 345.35001230015589,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "left": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "right": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "bottom": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "horizontal": {
                                                        "hasNoneStyle": false,
                                                        "lineStyle": "Cleared",
                                                        "lineWidth": 0,
                                                        "shadow": false,
                                                        "space": 0
                                                    },
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "keepWithNext": true,
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 42.54999923706055,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontColor": "#000000FF",
                                                "fontSizeBidi": 11,
                                                "fontFamilyFarEast": "Arial"
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontColor": "#000000FF",
                                                        "fontSizeBidi": 11,
                                                        "fontFamilyFarEast": "Arial"
                                                    },
                                                    "text": "3"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 79.8499984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 79.84999990687541,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        }
                    ],
                    "grid": [
                        345.35001230015589,
                        79.84999990687541
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "shading": {},
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 2.549999952316284,
                        "leftMargin": 1.399999976158142,
                        "bottomMargin": 0,
                        "preferredWidth": 425.20001220703127,
                        "preferredWidthType": "Point",
                        "bidi": false,
                        "allowAutoFit": false,
                        "styleName": "a"
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 2
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Es "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wurden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aufwendungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aufzinsung"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Altersversorgungsverpflichtung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR 128, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erträgen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verrechnenden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Deckungsvermögen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR 3 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "miteinander "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verrechnet."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "fontFamily": "Calibri",
                        "fontFamilyBidi": "Calibri",
                        "fontFamilyAscii": "Calibri",
                        "fontFamilyNonFarEast": "Calibri",
                        "fontFamilyFarEast": "Calibri"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "enthalten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Wesentlichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "solche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ausstehende "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rechnungen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Personalkosten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(Urlaubsrückstände "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "/ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Guthabenstunden "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "/ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "variable "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gehaltsbestandteile), "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Altersteilzeit, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Garantieverpflichtungen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Provisionen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Umsatzboni."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verbindlichkeiten"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sämtliche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verbindlichkeiten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "haben, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vorjahr, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Restlaufzeit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zu "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahr"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verbindlichkeiten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gegenüber "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verbundenen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Unternehmen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "umfassen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "solche "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gegenüber "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaftern "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR 1.731 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "3.485), "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Ergebnisabführungsvertrag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "resultieren, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "633 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "968) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Lieferungs- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Leistungsverkehr."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Haftungsverhältnisse"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dschinni"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " Gesellschaft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beschränkter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Haftung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nimmt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "am "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Cashpool"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "-Verfahren "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jasmin "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Finance"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ", "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bagdad, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Irak, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "einer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Aladdin "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gruppe, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "teil."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Das "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Risiko "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Inanspruchnahme "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "dem "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Haftungsverhältnis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "wird "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aufgrund "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "guten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vermögens-, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Finanz- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Ertragslage "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Pool-"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Führers "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "als "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gering "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eingeschätzt. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "styleName": "Normal",
                        "listFormat": {}
                    },
                    "characterFormat": {
                        "bold": true
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "\f"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 12,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sonstige finanzielle Verpflichtungen"
                        }
                    ]
                },
                {
                    "rows": [
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "styleName": "Normal",
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 252.3000030517578,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 252.29999626838095,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 71.55000305175781,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 71.55000112805338,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 19.200000762939454,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 19.200000246725268,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "TEUR"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.75,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 82.5999984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 82.59999625332478,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 3
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        },
                        {
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "listFormat": {},
                                                "tabs": [
                                                    {
                                                        "position": 14.199999809265137,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    },
                                                    {
                                                        "position": 28.350000381469728,
                                                        "deletePosition": 0,
                                                        "tabJustification": "Left",
                                                        "tabLeader": "None"
                                                    }
                                                ]
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "Verpflichtungen aus Miet- und Leasingverträgen"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "\u000B"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "\t"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "(davon aus verbundenen Unternehmen:       "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "\t"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "TEUR "
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "-"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "639 ("
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "Vj"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": ". TEUR 639"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "0"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "))"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 252.3000030517578,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 252.29999626838095,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 0
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 71.55000305175781,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 71.55000112805338,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 1
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": []
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 19.200000762939454,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 19.200000246725268,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 2
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "borders": {
                                                    "top": {},
                                                    "left": {},
                                                    "right": {},
                                                    "bottom": {},
                                                    "horizontal": {},
                                                    "vertical": {}
                                                },
                                                "textAlignment": "Right",
                                                "beforeSpacing": 6,
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {
                                                "fontSize": 10,
                                                "fontSizeBidi": 10
                                            },
                                            "inlines": [
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "-"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "911"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "\u000B"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "778"
                                                },
                                                {
                                                    "characterFormat": {
                                                        "fontSize": 10,
                                                        "fontSizeBidi": 10
                                                    },
                                                    "text": "\u000B"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "borders": {
                                            "top": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.75,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "left": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "right": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "bottom": {
                                                "color": "#000000FF",
                                                "hasNoneStyle": false,
                                                "lineStyle": "Single",
                                                "lineWidth": 0.75,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalDown": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "diagonalUp": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "horizontal": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            },
                                            "vertical": {
                                                "hasNoneStyle": false,
                                                "lineStyle": "None",
                                                "lineWidth": 0,
                                                "shadow": false,
                                                "space": 0
                                            }
                                        },
                                        "shading": {},
                                        "preferredWidth": 82.5999984741211,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 82.59999625332478,
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "verticalAlignment": "Top"
                                    },
                                    "columnIndex": 3
                                }
                            ],
                            "rowFormat": {
                                "height": 1,
                                "allowBreakAcrossPages": true,
                                "heightType": "AtLeast",
                                "isHeader": false,
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalDown": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "diagonalUp": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "None",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    }
                                },
                                "gridBefore": 0,
                                "gridAfter": 0
                            }
                        }
                    ],
                    "grid": [
                        252.29999626838095,
                        71.55000112805338,
                        19.200000246725268,
                        82.59999625332478
                    ],
                    "tableFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalDown": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "diagonalUp": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {
                                "hasNoneStyle": false,
                                "lineStyle": "None",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            }
                        },
                        "shading": {},
                        "leftIndent": 0,
                        "tableAlignment": "Left",
                        "topMargin": 0,
                        "rightMargin": 2.8499999046325685,
                        "leftMargin": 2.8499999046325685,
                        "bottomMargin": 0,
                        "preferredWidth": 425.6499938964844,
                        "preferredWidthType": "Point",
                        "bidi": false,
                        "allowAutoFit": false,
                        "styleName": "a0"
                    },
                    "description": null,
                    "title": null,
                    "columnCount": 4
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "\u000B"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Beträge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zum "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Nominalbetrag "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "angesetzt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "finanziellen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verpflichtungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "787 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(davon "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "verbundene "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Unternehmen: "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "619) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bereits "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "bis "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "31. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dezember "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2020 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "fällig. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nicht "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "innerhalb "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "eines "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jahres "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "fälligen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "finanziellen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Verpflichtungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ergeben "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sich "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Miet- "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Leasingverträgen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dritten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Laufzeiten "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "zwischen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1. Januar "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2021 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "31. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dezember "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "2022."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erläuterungen zur Gewinn- und Verlustrechnung"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sonstige betriebliche Erträge"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "In "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sonstigen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "betrieblichen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erträgen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "periodenfremde "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Erträge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Höhe "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR 121 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "0), "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "aus "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Auflösung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "enthalten. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sonstige Angaben"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zusammensetzung der Organe und deren Bezüge"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführer:"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Teppich, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführer, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Marrakesch "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Jago"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ", "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführer, "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Kairo, "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Zur "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vertretung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführer "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "jeweils "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "allein "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "befugt. "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Sie "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "gemäß "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Handelsregister "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Beschränkungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "des "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "§ "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "181 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "BGB "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "befreit."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "erhält "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "keine "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bezüge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "von "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Gesellschaft."
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Rückstellungen für Pensionen und Anwartschaften ehemaliger Mitglieder der "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführung "
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sowie Bezüge früherer Organmitglieder"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "afterSpacing": 16,
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "_heading=h.30j0zll",
                            "properties": {
                                "columnFirst": 0,
                                "columnLast": 0
                            }
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "_heading=h.30j0zll"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ehemalige "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Mitglieder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ihre "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Hinterbliebenen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "betrugen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Bezüge "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR 57 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "55). "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Für "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ehemalige "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Mitglieder "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "der "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsführung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "ihre "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Hinterbliebenen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "sind "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "in "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "den "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Pensionsrückstellungen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "737 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "TEUR "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "705) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "enthalten. "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "afterSpacing": 18,
                        "styleName": "Normal",
                        "keepLinesTogether": true,
                        "keepWithNext": true,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 212.60000610351563,
                                "deletePosition": 0,
                                "tabJustification": "Center",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Anzahl der Mitarbeiter"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "borders": {
                            "top": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "left": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "right": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "bottom": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "horizontal": {
                                "hasNoneStyle": false,
                                "lineStyle": "Cleared",
                                "lineWidth": 0,
                                "shadow": false,
                                "space": 0
                            },
                            "vertical": {}
                        },
                        "textAlignment": "Justify",
                        "lineSpacing": 1.1999999284744263,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 28.350000381469728,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            },
                            {
                                "position": 56.70000076293945,
                                "deletePosition": 0,
                                "tabJustification": "Left",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontColor": "#000000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyFarEast": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "_heading=h.1fob9te",
                            "properties": {
                                "columnFirst": 0,
                                "columnLast": 0
                            }
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "_heading=h.1fob9te"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Die "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Dschinni"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": " Gesellschaft "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "mit "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beschränkter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Haftung "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "beschäftigte "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "nach "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Köpfen "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Geschäftsjahr "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "im "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Durchschnitt "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "111 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Mitarbeiter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "(davon "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "50 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Arbeiter "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "60 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Angestellte) "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "und "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "1 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Auszubildender "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "("
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Vj"
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": ". "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "113 "
                        },
                        {
                            "characterFormat": {
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 11,
                                "fontFamilyFarEast": "Arial"
                            },
                            "text": "Mitarbeiter). "
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {}
                                },
                                "textAlignment": "Right",
                                "beforeSpacing": 24,
                                "afterSpacing": 24,
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 9,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 9,
                                "fontFamilyFarEast": "Arial"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "Anlage 3"
                                }
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {}
                                },
                                "leftIndent": 36,
                                "textAlignment": "Justify",
                                "styleName": "Normal",
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 424.70001220703127,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                                "fontSize": 9,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 9,
                                "fontFamilyFarEast": "Arial"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 0,
                                    "hasFieldEnd": true
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "PAGE"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "/8"
                                }
                            ]
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {}
                                },
                                "beforeSpacing": 24,
                                "afterSpacing": 24,
                                "styleName": "Normal",
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 9,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 9,
                                "fontFamilyFarEast": "Arial"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "Anlage 3"
                                }
                            ]
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "borders": {
                                    "top": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "left": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "right": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "bottom": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "horizontal": {
                                        "hasNoneStyle": false,
                                        "lineStyle": "Cleared",
                                        "lineWidth": 0,
                                        "shadow": false,
                                        "space": 0
                                    },
                                    "vertical": {}
                                },
                                "styleName": "Normal",
                                "listFormat": {},
                                "tabs": [
                                    {
                                        "position": 424.70001220703127,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                                "fontSize": 9,
                                "fontColor": "#000000FF",
                                "fontSizeBidi": 9,
                                "fontFamilyFarEast": "Arial"
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 0,
                                    "hasFieldEnd": true
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "PAGE"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {},
                                    "text": ""
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "/9"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 9,
                                        "fontColor": "#000000FF",
                                        "fontSizeBidi": 9,
                                        "fontFamilyFarEast": "Arial"
                                    },
                                    "text": "\t"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ],
    "characterFormat": {
        "fontSize": 11,
        "fontFamily": "Arial",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial",
        "localeIdBidi": 1025,
        "localeId": 1031,
        "localeIdFarEast": 1031,
        "fontFamilyAscii": "Arial",
        "fontFamilyNonFarEast": "Arial",
        "fontFamilyFarEast": "Arial"
    },
    "paragraphFormat": {
        "borders": {
            "top": {},
            "left": {},
            "right": {},
            "bottom": {},
            "horizontal": {},
            "vertical": {}
        },
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 0,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "outlineLevel": "BodyText",
        "bidi": false,
        "keepLinesTogether": false,
        "keepWithNext": false,
        "widowControl": true,
        "listFormat": {}
    },
    "fontSubstitutionTable": {},
    "themeFontLanguages": {
        "localeId": 1031
    },
    "defaultTabWidth": 36,
    "trackChanges": false,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "dontUseHTMLParagraphAutoSpacing": false,
    "formFieldShading": true,
    "compatibilityMode": "Word2013",
    "allowSpaceOfSameStyleInTable": false,
    "themes": {
        "fontScheme": {
            "fontSchemeName": "Office",
            "majorFontScheme": {
                "fontSchemeList": [
                    {
                        "name": "latin",
                        "typeface": "Calibri Light",
                        "panose": "020F0302020204030204"
                    },
                    {
                        "name": "ea",
                        "panose": "020F0302020204030204"
                    },
                    {
                        "name": "cs",
                        "panose": "020F0302020204030204"
                    }
                ],
                "fontTypeface": {
                    "Jpan": "游ゴシック Light",
                    "Hang": "맑은 고딕",
                    "Hans": "等线 Light",
                    "Hant": "新細明體",
                    "Arab": "Times New Roman",
                    "Hebr": "Times New Roman",
                    "Thai": "Angsana New",
                    "Ethi": "Nyala",
                    "Beng": "Vrinda",
                    "Gujr": "Shruti",
                    "Khmr": "MoolBoran",
                    "Knda": "Tunga",
                    "Guru": "Raavi",
                    "Cans": "Euphemia",
                    "Cher": "Plantagenet Cherokee",
                    "Yiii": "Microsoft Yi Baiti",
                    "Tibt": "Microsoft Himalaya",
                    "Thaa": "MV Boli",
                    "Deva": "Mangal",
                    "Telu": "Gautami",
                    "Taml": "Latha",
                    "Syrc": "Estrangelo Edessa",
                    "Orya": "Kalinga",
                    "Mlym": "Kartika",
                    "Laoo": "DokChampa",
                    "Sinh": "Iskoola Pota",
                    "Mong": "Mongolian Baiti",
                    "Viet": "Times New Roman",
                    "Uigh": "Microsoft Uighur",
                    "Geor": "Sylfaen",
                    "Armn": "Arial",
                    "Bugi": "Leelawadee UI",
                    "Bopo": "Microsoft JhengHei",
                    "Java": "Javanese Text",
                    "Lisu": "Segoe UI",
                    "Mymr": "Myanmar Text",
                    "Nkoo": "Ebrima",
                    "Olck": "Nirmala UI",
                    "Osma": "Ebrima",
                    "Phag": "Phagspa",
                    "Syrn": "Estrangelo Edessa",
                    "Syrj": "Estrangelo Edessa",
                    "Syre": "Estrangelo Edessa",
                    "Sora": "Nirmala UI",
                    "Tale": "Microsoft Tai Le",
                    "Talu": "Microsoft New Tai Lue",
                    "Tfng": "Ebrima"
                }
            },
            "minorFontScheme": {
                "fontSchemeList": [
                    {
                        "name": "latin",
                        "typeface": "Calibri",
                        "panose": "020F0502020204030204"
                    },
                    {
                        "name": "ea",
                        "panose": "020F0502020204030204"
                    },
                    {
                        "name": "cs",
                        "panose": "020F0502020204030204"
                    }
                ],
                "fontTypeface": {
                    "Jpan": "游明朝",
                    "Hang": "맑은 고딕",
                    "Hans": "等线",
                    "Hant": "新細明體",
                    "Arab": "Arial",
                    "Hebr": "Arial",
                    "Thai": "Cordia New",
                    "Ethi": "Nyala",
                    "Beng": "Vrinda",
                    "Gujr": "Shruti",
                    "Khmr": "DaunPenh",
                    "Knda": "Tunga",
                    "Guru": "Raavi",
                    "Cans": "Euphemia",
                    "Cher": "Plantagenet Cherokee",
                    "Yiii": "Microsoft Yi Baiti",
                    "Tibt": "Microsoft Himalaya",
                    "Thaa": "MV Boli",
                    "Deva": "Mangal",
                    "Telu": "Gautami",
                    "Taml": "Latha",
                    "Syrc": "Estrangelo Edessa",
                    "Orya": "Kalinga",
                    "Mlym": "Kartika",
                    "Laoo": "DokChampa",
                    "Sinh": "Iskoola Pota",
                    "Mong": "Mongolian Baiti",
                    "Viet": "Arial",
                    "Uigh": "Microsoft Uighur",
                    "Geor": "Sylfaen",
                    "Armn": "Arial",
                    "Bugi": "Leelawadee UI",
                    "Bopo": "Microsoft JhengHei",
                    "Java": "Javanese Text",
                    "Lisu": "Segoe UI",
                    "Mymr": "Myanmar Text",
                    "Nkoo": "Ebrima",
                    "Olck": "Nirmala UI",
                    "Osma": "Ebrima",
                    "Phag": "Phagspa",
                    "Syrn": "Estrangelo Edessa",
                    "Syrj": "Estrangelo Edessa",
                    "Syre": "Estrangelo Edessa",
                    "Sora": "Nirmala UI",
                    "Tale": "Microsoft Tai Le",
                    "Talu": "Microsoft New Tai Lue",
                    "Tfng": "Ebrima"
                }
            }
        }
    },
    "background": {
        "color": "#FFFFFFFF"
    },
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "listFormat": {}
            },
            "characterFormat": {
                "fontSizeBidi": 12,
                "fontFamilyFarEast": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 24,
                "afterSpacing": 6,
                "outlineLevel": "Level1",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 24,
                "fontSizeBidi": 24
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 18,
                "afterSpacing": 4,
                "outlineLevel": "Level2",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 18,
                "fontSizeBidi": 18
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 14,
                "afterSpacing": 4,
                "outlineLevel": "Level3",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 14,
                "fontSizeBidi": 14
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 12,
                "afterSpacing": 2,
                "outlineLevel": "Level4",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 12
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 11,
                "afterSpacing": 2,
                "outlineLevel": "Level5",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 10,
                "afterSpacing": 2,
                "outlineLevel": "Level6",
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontSizeBidi": 10
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {}
        },
        {
            "name": "Normal Table",
            "type": "Table",
            "next": "Normal Table"
        },
        {
            "name": "Title",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 24,
                "afterSpacing": 6,
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 36,
                "fontSizeBidi": 36
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Lauftext 12/16",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "textAlignment": "Justify",
                "afterSpacing": 16,
                "lineSpacing": 1.1999999284744263,
                "lineSpacingType": "Multiple",
                "listFormat": {},
                "tabs": [
                    {
                        "position": 28.350000381469728,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 56.70000076293945,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {},
            "basedOn": "Normal",
            "link": "Lauftext 12/16 Zchn",
            "next": "Lauftext 12/16"
        },
        {
            "name": "Lauftext 12/16 Zchn",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Arial",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "fontFamilyAscii": "Arial",
                "fontFamilyNonFarEast": "Arial",
                "fontFamilyFarEast": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "textAlignment": "Right",
                "beforeSpacing": 24,
                "afterSpacing": 24,
                "lineSpacing": 12,
                "lineSpacingType": "Exactly",
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 9
            },
            "basedOn": "Normal",
            "link": "Header Char",
            "next": "Header"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 9,
                "fontFamily": "Arial",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "fontFamilyAscii": "Arial",
                "fontFamilyNonFarEast": "Arial",
                "fontFamilyFarEast": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footer",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "listFormat": {},
                "tabs": [
                    {
                        "position": 424.70001220703127,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 9
            },
            "basedOn": "Normal",
            "link": "Footer Char",
            "next": "Footer"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Arial",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "fontFamilyAscii": "Arial",
                "fontFamilyNonFarEast": "Arial",
                "fontFamilyFarEast": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Tabelle",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "listFormat": {},
                "tabs": [
                    {
                        "position": 14.199999809265137,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 28.350000381469728,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 42.54999923706055,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {},
            "basedOn": "Normal",
            "link": "Tabelle Zchn",
            "next": "Lauftext 12/16"
        },
        {
            "name": "Tabelle Zchn",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Arial",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Arial",
                "fontFamilyAscii": "Arial",
                "fontFamilyNonFarEast": "Arial",
                "fontFamilyFarEast": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Überschrift4",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "afterSpacing": 18,
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {},
                "tabs": [
                    {
                        "position": 28.350000381469728,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 56.70000076293945,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "bold": true
            },
            "basedOn": "Normal",
            "next": "Lauftext 12/16"
        },
        {
            "name": "Überschrift-Anlagen",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "textAlignment": "Left",
                "afterSpacing": 0,
                "keepWithNext": true,
                "listFormat": {},
                "tabs": [
                    {
                        "position": 0,
                        "deletePosition": 28.35,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 0,
                        "deletePosition": 56.7,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 453.6000061035156,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 13
            },
            "basedOn": "Lauftext 12/16",
            "next": "Überschrift-Anlagen"
        },
        {
            "name": "Einrückung 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 28.350000381469728,
                "firstLineIndent": 0,
                "listFormat": {
                    "listId": 0,
                    "nsid": 140082873
                },
                "tabs": [
                    {
                        "position": 0,
                        "deletePosition": 28.35,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 0,
                        "deletePosition": 56.7,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 18,
                        "deletePosition": 0,
                        "tabJustification": "List",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {},
            "basedOn": "Lauftext 12/16",
            "next": "Einrückung 1"
        },
        {
            "name": "Subtitle",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "beforeSpacing": 18,
                "afterSpacing": 4,
                "keepLinesTogether": true,
                "keepWithNext": true,
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 24,
                "fontFamily": "Georgia",
                "fontColor": "#666666FF",
                "fontSizeBidi": 24,
                "fontFamilyBidi": "Georgia",
                "fontFamilyAscii": "Georgia",
                "fontFamilyNonFarEast": "Georgia",
                "fontFamilyFarEast": "Georgia"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "a",
            "type": "Table",
            "basedOn": "Normal Table",
            "next": "a"
        },
        {
            "name": "a0",
            "type": "Table",
            "basedOn": "Normal Table",
            "next": "a0"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720948,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level7",
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720948,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level8",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#333333",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#333333",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "borders": {
                    "top": {},
                    "left": {},
                    "right": {},
                    "bottom": {},
                    "horizontal": {},
                    "vertical": {}
                },
                "leftIndent": 0,
                "rightIndent": 0,
                "firstLineIndent": 0,
                "textAlignment": "Left",
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "lineSpacing": 1.0791666507720948,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level9",
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#333333",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Normal",
            "link": "Heading 9 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 9 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#333333",
                "fontFamilyAscii": "Calibri Light",
                "fontFamilyNonFarEast": "Calibri Light",
                "fontFamilyFarEast": "Calibri Light"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "levelOverrides": [],
            "listId": 0,
            "nsid": 140082873
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "nsid": 140082873,
            "levels": [
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "paraStyleName": "Einrückung 1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 72,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 72,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%2.",
                    "paraStyleName": "",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 108,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 108,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%3.",
                    "paraStyleName": "",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 144,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 144,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "paraStyleName": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 180,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 180,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%5.",
                    "paraStyleName": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 216,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 216,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%6.",
                    "paraStyleName": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 252,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 252,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "paraStyleName": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 288,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 288,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%8.",
                    "paraStyleName": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {},
                    "paragraphFormat": {
                        "borders": {
                            "top": {},
                            "left": {},
                            "right": {},
                            "bottom": {},
                            "horizontal": {},
                            "vertical": {}
                        },
                        "leftIndent": 324,
                        "firstLineIndent": -36,
                        "listFormat": {},
                        "tabs": [
                            {
                                "position": 324,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "isLegalStyleNumbering": false,
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%9.",
                    "paraStyleName": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        }
    ],
    "comments": [
        {
            "commentId": "e185d657-0876-427b-b6be-eb81086521a6",
            "author": "Demo User",
            "date": "2023-07-25T11:06:54Z",
            "blocks": [],
            "done": false,
            "replyComments": []
        },
        {
            "commentId": "f29ace6d-9032-4ab3-bfa7-93a373eba968",
            "author": "Demo User",
            "date": "2023-07-25T14:07:39Z",
            "blocks": [],
            "done": false,
            "replyComments": []
        }
    ],
    "revisions": [
        {
            "author": "Demo User",
            "date": "2023-07-24T11:57:11Z",
            "revisionType": "Insertion",
            "revisionId": "388b53fc-8f0f-4b64-b5d0-0e9eb917b53a"
        },
        {
            "author": "Demo User",
            "date": "2023-07-25T14:07:31Z",
            "revisionType": "Insertion",
            "revisionId": "100903d0-1bf3-4b56-8d27-550df4ea6ac3"
        },
        {
            "author": "Demo User",
            "date": "2023-07-25T15:34:28Z",
            "revisionType": "Insertion",
            "revisionId": "e8a3761f-ee0a-4573-853a-fd5800f9f2d3"
        }
    ],
    "customXml": [],
    "images": {},
    "footnotes": {
        "separator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    },
    "endnotes": {
        "separator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": [
                    {
                        "characterFormat": {},
                        "text": "\u0004"
                    }
                ]
            }
        ],
        "continuationNotice": [
            {
                "paragraphFormat": {
                    "borders": {
                        "top": {},
                        "left": {},
                        "right": {},
                        "bottom": {},
                        "horizontal": {},
                        "vertical": {}
                    },
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};
describe('Save the empty comment Doocument', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({ isReadOnly: false })
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
        documenteditor.editor.insertText("Adventure Works Cycles, the fictitious company on which the Adventure Works sample ");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Save empty comment with inline', () => {
        console.log('Save empty comment with inline');
        documenteditor.open(json);
        documenteditor.documentEditorSettings.optimizeSfdt = false;
        let exported: string = documenteditor.serialize();
        expect(exported).toContain('"blocks":[{"inlines":[{}]}]');

    });
});
describe('Document deafult character format API validation', () => {
    let documenteditor: DocumentEditor;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        documenteditor = new DocumentEditor({ isReadOnly: false })
        documenteditor.enableAllModules();
        documenteditor.appendTo("#container");
    });
    afterAll((done) => {
        documenteditor.destroy();
        document.body.removeChild(document.getElementById('container'));
        documenteditor = undefined;
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Set character format API validation', () => {
        console.log('Set character format API validation');
        documenteditor.openBlank();
        documenteditor.setDocumentCharacterFormat({ fontSize: 20 });
        expect(documenteditor.selection.characterFormat.fontSize).toBe(20);
    });
    it('Get character format API validation', () => {
        console.log('Get character format API validation');
        let format: any = documenteditor.getDocumentCharacterFormat();
        expect(format.fontSize).toBe(20);
    });
});



