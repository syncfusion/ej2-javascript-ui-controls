import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, SfdtExport } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('HTML Writer validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Underline Strikethrough validation.', () => {
        console.log('Underline Strikethrough validation');
        editor.openBlank();
        editor.editorModule.insertText('hello world');
        editor.selection.selectAll();
        editor.selection.characterFormat.underline = 'Single';
        editor.selection.characterFormat.strikethrough = 'SingleStrike';
        expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:line-through underline;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:line-through underline;">hello world</span></div>');
    })
    it('Strikethrough validation.', () => {
        console.log('Strikethrough validation.');
        editor.openBlank();
        editor.editorModule.insertText('hello world');
        editor.selection.selectAll();        
        editor.selection.characterFormat.strikethrough = 'SingleStrike';
        expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:line-through ;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:line-through ;">hello world</span></div>');
    })
    it('Underline validation.', () => {
        console.log('Underline validation.');
        editor.openBlank();
        editor.editorModule.insertText('hello world');
        editor.selection.selectAll();
        editor.selection.characterFormat.underline = 'Single';
        expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;text-decoration:underline;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;text-decoration:underline;">hello world</span></div>');
    })
    it('Backgroundcolor validaion', () => {
        let de: string = '{"sections":[{"blocks":[{"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":8.5,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"topMargin":2.85,"bottomMargin":2.85},"cells":[{"blocks":[{"characterFormat":{"bold":true,"boldBidi":true},"inlines":[{"text":"NAME OF INSURED:","characterFormat":{"bold":true,"boldBidi":true}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":134.69999694824219,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":134.69999694824219}},{"blocks":[{"inlines":[{"text":"test"}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":326.0,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone"},"cellWidth":326.0}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":false,"topMargin":2.8499999046325684,"bottomMargin":2.8499999046325684,"leftIndent":0.0,"tableAlignment":"Left","preferredWidth":460.70001220703125,"preferredWidthType":"Point","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]}],"sectionFormat":{"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"pageWidth":595.29998779296875,"pageHeight":841.9000244140625,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":true,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","columns":{"column":[{"width":451.29998779296875,"space":0.0}],"numberOfColumns":1,"equalWidth":true}}}],"compatibilityMode":"Word2013"}';
        console.log('Backgroundcolor validaion.');
        editor.open(de);
        editor.selection.selectAll();
        expect(editor.selection.getHtmlContent()).toEqual('<div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre">&nbsp</div><table border="1" cellpadding="0" style=" border-collapse:collapse;border-left-style:none;border-right-style:none;border-right-width:0pt;border-top-style:none;border-top-width:0pt;border-bottom-style:none;border-bottom-width:0pt;"><tr height="11.33333"><td width="179.6" valign="top" style="border:solid 1px;"><div style="font-weight:bold;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:bold;font-style:normal;">NAME OF INSURED:</span></div></td><td width="434.66666999999995" valign="top" style="border:solid 1px;"><div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre"><span style="font-weight:normal;font-style:normal;">test</span></div></td></table><div style="font-weight:normal;font-style:normal;color:#000000;font-size:11pt;font-family:Calibri;text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:0pt; margin-left:0pt; line-height:1;white-space:pre">&nbsp</div>');
    })


})