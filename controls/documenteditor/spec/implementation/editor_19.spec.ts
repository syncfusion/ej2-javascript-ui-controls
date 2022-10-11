
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TableOfContentsSettings, ParagraphWidget, TableWidget, FieldElementBox, TextFormField, ElementBox, WParagraphFormat, WCharacterFormat, HelperMethods, ContentControlWidgetType, ContentControlType, IWidget, TableRowWidget, DocumentHelper, Page, PageSetupDialog, SfdtExport, XmlHttpRequestEventArgs } from '../../src/document-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { ImageResizer } from '../../src/document-editor/implementation/editor/image-resizer';
import { Editor, EditorHistory, TableCellWidget, TextElementBox, TextHelper, RtlInfo, ListTextElementBox, LineWidget, TabElementBox, TextPosition } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection, PageLayoutViewer } from '../../src/index';

describe('Resolve inconsistent behaviour of text selection inside an editable table cell within a read only document', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true,height:"800px"});
      editor = new DocumentEditor({ isReadOnly: false,height:"800px" });
      editor.enableAllModules();
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
      setTimeout(() => {
        done();
      }, 1000);
    });
    it('Protection inside table checking', () => {
      editor.editor.insertTable();
      editor.selection.selectTable();
      editor.editor.insertEditingRegion();
      editor.editor.insertText('s');
      editor.selection.selectTable();
     expect( editor.selection.text.indexOf('s')).toBe(0);
    });
 });

  describe('beforeXmlHttpRequestSend event validation', () => {
    let editor: DocumentEditor = undefined;
    let istriggered:boolean=false;
    beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({ isReadOnly: false,height:"800px" });
      editor.enableAllModules();      
      (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
      (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
      (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
      (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
      editor.beforeXmlHttpRequestSend=function(args:XmlHttpRequestEventArgs){

        istriggered=true;
        args.cancel=true;
       };
      editor.appendTo('#container');
    });
    afterAll((done) => {
      editor.destroy();
      document.body.removeChild(document.getElementById('container'));
      editor = undefined;
      document.body.innerHTML = '';
      setTimeout(() => {
        done();
      }, 1000);
    });
    it('Checking in protection type', () => {
    editor.editor.enforceProtection('123','ReadOnly');
    expect(istriggered).toBe(true);
    });
  });

  let sfdtContent: any = {"sections":[{"blocks":[{"inlines":[{"text":"Hello world"}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","pageNumberStyle":"Arabic","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial","localeId":1033,"localeIdEastAsia":1033,"localeIdBidi":1025},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"XOH98UiIqRYguZOJrdyhaiJT/ZAESiNUnJiY0c3mrcpjOjazZWA4P17WWfB2SsNCLasE1rGsOYn/nzzLVVab/w==","saltValue":"uuHnaH8T7/BkKwWc7htbWA==","cryptProviderType":"rsaAES","cryptAlgorithmClass":"hash","cryptAlgorithmType":"typeAny","cryptAlgorithmSid":"14","cryptSpinCount":"100000","dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"inlines":[{"text":"\u0003"}]}],"continuationSeparator":[{"inlines":[{"text":"\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"};
  describe('Trying to unprotect document with wrong password validation', () => {
    let editor: DocumentEditor = undefined;
    let istriggered: boolean = false;
    beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({ isReadOnly: false, height: "800px" });
      editor.enableAllModules();
      (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
      (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
      (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
      (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
      editor.beforeXmlHttpRequestSend = function (args: XmlHttpRequestEventArgs) {
        istriggered = true;
        args.cancel = true;
      };
      editor.appendTo('#container');
    });
    afterAll((done) => {
      editor.destroy();
      document.body.removeChild(document.getElementById('container'));
      editor = undefined;
      document.body.innerHTML = '';
      setTimeout(() => {
        done();
      }, 1000);
    });
    it('Unprotect document with wrong password validation', () => {
      editor.open(sfdtContent);
      editor.editor.stopProtection('');
      expect(istriggered).toBe(true);
    });
  });
let pasteContent: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 612,
				"pageHeight": 792,
				"leftMargin": 72,
				"rightMargin": 72,
				"topMargin": 72,
				"bottomMargin": 72,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"headerDistance": 36,
				"footerDistance": 36,
				"bidi": false,
				"pageNumberStyle": "Arabic"
			},
			"blocks": [
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a est non nunc congue sollicitudin et "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "posuere arcu. Quisque ultricies nec dolor et aliquet. In ut augue lacinia ipsum commodo dictum quis "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "vitae lacus. Praesent consectetur gravida vulputate."
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": " Morbi non libero et magna sagittis tempor a et nulla. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Phasellus ac scelerisque lacus, nec pharetra justo. Fusce sed volutpat risus. Aliquam mattis turpis vitae "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "suscipit tristique. Aliquam ut sodales mi, commodo viverra nisl. Praesent lacinia accumsan lec"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "t"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "us, sit "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "amet bibendum neque sollicitudin quis. Etiam non pretium mauris, in eleifend mauris. Duis tincidunt "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "eleifend ex. Nunc euismod erat ante, convallis vulputate metus maximus vel. Donec fringilla ultrices "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "tortor, et finibus tellus viverra at. Praesent"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "eget suscipit dui. Integer sed metus posuere, elementum "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "tortor at, egestas sem."
						}
					]
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Etiam in lorem sed felis porttitor porta. Donec eget neque eu mi dictum cursus. Fusce blandit turpis sit "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "amet arcu mattis placerat. Aenean ornare neque turpis, id bibendum eros vehicula vitae. Integer eget "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "venenatis risus. Curabitur non dignissim orci. Se"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "d"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": " rutrum nec sapien at mattis. Praesent dictum erat vel "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "dui rutrum posuere. Phasellus et erat nec libero sodales tincidunt. Nam a quam commodo, posuere "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "ipsum vel, congue dolor. Donec commodo cursus lectus at aliquam. Donec ac tellus non odio mollis "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "convall"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "i"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "s sit amet ac lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus lectus "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "enim, id convallis lorem fermentum sed. Cras ultrices velit lacus. Donec faucibus eget diam at lobortis."
						}
					]
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Maecenas eleifend fermentum lacus quis feugiat. Aliqu"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "am semper arcu et gravida facilisis. Aenean at dui "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "et leo molestie volutpat. Curabitur accumsan libero iaculis auctor euismod. Nullam accumsan augue "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "turpis, sed interdum leo rutrum at. Aliquam non fringilla mauris, at venenatis augue. Vivamus dapibus "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "mole"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "s"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "tie porttitor. Nulla ultrices purus nisi, vitae semper risus luctus dapibus. Phasellus luctus tortor leo, "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "sit amet sollicitudin sapien consequat a. Aenean blandit commodo purus nec tempor. Nam posuere elit "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "nec nibh auctor, vel pulvinar metus fringilla. Pr"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "o"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "in finibus ante vel egestas suscipit. Nullam accumsan erat "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "ac eros aliquam, vel dictum arcu rutrum. Aliquam non suscipit nisl."
						}
					]
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Quisque id lacus eu mi ultrices ultrices. Sed sagittis, nunc et bibendum porta, neque tortor fermentum "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "dui, in aliquam dolor eli"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "t vel sapien. Aliquam quam dui, scelerisque quis urna vel, convallis blandit libero. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Proin egestas purus sed ex maximus, ac porttitor purus sagittis. Nam vitae ex id velit porta accumsan. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Duis commodo tortor vitae rutrum euismod. Nullam ante risus, luctus"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "eget laoreet vel, faucibus a odio. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Pellentesque porttitor ultricies erat. Suspendisse faucibus pretium odio."
						}
					]
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Donec convallis interdum nisl, sit amet blandit velit. Quisque vitae massa id quam porta eleifend. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Maecenas sed felis id ligula molestie tristique"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": " in quis tortor. Quisque tempor turpis eros, ut accumsan "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "tortor dapibus dapibus. Nunc vestibulum interdum placerat. Mauris ut ligula nec lectus auctor rutrum ac "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "vitae massa. Vestibulum fermentum dolor sed diam porttitor ultrices. Donec quis molestie nulla,"
						},
						{
							"characterFormat": {},
							"text": " "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "in "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "vehicula mi. Ut non blandit nibh. Nam dictum est nec molestie sagittis."
						}
					]
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"left": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"right": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"bottom": {
								"hasNoneStyle": true,
								"lineStyle": "None",
								"lineWidth": 0,
								"shadow": false,
								"space": 0
							},
							"horizontal": {},
							"vertical": {}
						},
						"leftIndent": 0,
						"rightIndent": 0,
						"firstLineIndent": 0,
						"textAlignment": "Left",
						"beforeSpacing": 0,
						"afterSpacing": 10,
						"spaceBeforeAuto": false,
						"spaceAfterAuto": false,
						"lineSpacing": 1.149999976158142,
						"lineSpacingType": "Multiple",
						"styleName": "Normal",
						"outlineLevel": "BodyText",
						"listFormat": {},
						"bidi": false,
						"keepLinesTogether": false,
						"keepWithNext": false,
						"contextualSpacing": false,
						"widowControl": false
					},
					"characterFormat": {
						"bold": false,
						"italic": false,
						"fontSize": 11,
						"fontFamily": "Calibri",
						"underline": "None",
						"strikethrough": "None",
						"baselineAlignment": "Normal",
						"highlightColor": "NoColor",
						"fontColor": "#00000000",
						"bidi": false,
						"boldBidi": false,
						"italicBidi": false,
						"fontSizeBidi": 11,
						"fontFamilyBidi": "Calibri",
						"allCaps": false,
						"localeIdBidi": 1033
					},
					"inlines": [
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Ut convallis massa metus, in fringilla tortor lacinia a. Fusce quis nulla vel purus convallis fermentum eu at "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "arcu. Duis sed vulputate nibh. Praesent tempus libero ac vehicula imp"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "erdiet. Aenean commodo at metus "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "vitae accumsan. Mauris eget purus magna. Nunc a nunc justo. Maecenas sed laoreet felis. In a urna est. "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "Integer ornare eros at velit dignissim porttitor quis a odio. Quisque vitae facilisis nulla, non maximus "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "diam. Integer v"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "e"
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "l sem lacus. Vivamus non nisi lorem. Phasellus rutrum lectus a risus fringilla, eu "
						},
						{
							"characterFormat": {
								"bold": false,
								"italic": false,
								"fontSize": 11,
								"fontFamily": "Calibri",
								"underline": "None",
								"strikethrough": "None",
								"fontColor": "#00000000",
								"bidi": false,
								"boldBidi": false,
								"italicBidi": false,
								"fontSizeBidi": 11,
								"fontFamilyBidi": "Calibri",
								"allCaps": false,
								"localeIdBidi": 1033
							},
							"text": "commodo nisl fermentum."
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
					"characterFormat": {},
					"inlines": []
				}
			],
			"headersFooters": {
				"header": {
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
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"footer": {
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
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenHeader": {},
				"evenFooter": {},
				"firstPageHeader": {},
				"firstPageFooter": {}
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"fontSize": 11,
		"fontFamily": "Calibri",
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"highlightColor": "NoColor",
		"fontColor": "#00000000",
		"boldBidi": false,
		"italicBidi": false,
		"fontSizeBidi": 11,
		"fontFamilyBidi": "Calibri",
		"allCaps": false
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
		"listFormat": {},
		"bidi": false,
		"keepLinesTogether": false,
		"keepWithNext": false,
		"widowControl": true
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
			"characterFormat": {},
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 12,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 1 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 1 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 16,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 2 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 2 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level3",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 3 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 3 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 4 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 4 Char",
			"type": "Character",
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 5 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 5 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
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
				"leftIndent": 0,
				"rightIndent": 0,
				"firstLineIndent": 0,
				"textAlignment": "Left",
				"beforeSpacing": 2,
				"afterSpacing": 0,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Normal",
			"link": "Heading 6 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 6 Char",
			"type": "Character",
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		}
	],
	"lists": [],
	"abstractLists": [],
	"comments": [],
	"revisions": [],
	"customXml": []
};
let firstPageHeader: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":96.4000015258789,"rightMargin":96.4000015258789,"topMargin":56.70000076293945,"bottomMargin":56.70000076293945,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#0000FFFF"},"inlines":[{"characterFormat":{"fontColor":"#0000FFFF"},"text":"Fdghd"}]}],"headersFooters":{"firstPageHeader":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Right","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"inlines":[{"characterFormat":{"fontSize":10,"styleName":"Campos","fontSizeBidi":10},"text":"Pam"}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":1025},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2003","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Tabla normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Tabla normal"},{"name":"No List1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"No List1"},{"name":"Campos","type":"Character","characterFormat":{"fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Avisos","type":"Character","characterFormat":{"fontColor":"#FF0000FF"},"basedOn":"Default Paragraph Font"},{"name":"Comment Reference1","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
  describe('Resolve the header removing issue pasting in empty body content', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
      document.body.innerHTML = '';
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true,height:"800px"});
      editor = new DocumentEditor({ isReadOnly: false,height:"800px" });
      editor.enableAllModules();
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
      setTimeout(() => {
        done();
      }, 1000);
    });
    it('Resolve the header removing issue pasting in empty body content', () => {
      editor.open(JSON.stringify(firstPageHeader));
      editor.selection.selectAll();
      editor.editor.delete();
      editor.editor.pasteContents(pasteContent);
      editor.selection.goToPage(1);
      expect(editor.selection.start.paragraph.bodyWidget.sectionFormat.differentFirstPage).toBe(true);
      editor.selection.goToHeader();
      editor.selection.selectAll();
      expect(editor.selection.text).toBe('Pam\r');
    });
 });
 describe('Check the continue header in table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: true });
        DocumentEditor.Inject(Editor, Selection);
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Check the continue header in table', () => {
        console.log('Check the continue header in table');
        let text: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"}]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Header"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":true,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"shading":{},"preferredWidth":467.5,"preferredWidthType":"Point","cellWidth":467.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0}},"gridBefore":0,"gridAfter":0}}],"grid":[467.5],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0,"shadow":false,"space":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false,"localeIdBidi":1025},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
        editor.open(JSON.stringify(text));
        editor.documentHelper.removePage(editor.documentHelper.pages[0]);
        expect(editor.documentHelper.pages[1].repeatHeaderRowTableWidget).toEqual(true);
    });
});
describe('Resolve the even page header disappear issue while press enter inside the header', () => {
	let editor: DocumentEditor = undefined;
	beforeAll(() => {
		document.body.innerHTML = '';
		let ele: HTMLElement = createElement('div', { id: 'container' });
		document.body.appendChild(ele);
		editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true, height: "800px" });
		editor = new DocumentEditor({ isReadOnly: false, height: "800px" });
		editor.enableAllModules();
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
		setTimeout(() => {
			done();
		}, 1000);
	});
	it('Resolve the even page header disappear issue while press enter inside the header', () => {
		console.log("Resolve the even page header disappear issue while press enter inside the header");
		let text: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": true, "differentOddAndEvenPages": true, "headerDistance": 36, "footerDistance": 36, "bidi": false, "pageNumberStyle": "Arabic" }, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 18, "afterSpacing": 30, "styleName": "Heading 1", "listFormat": {} }, "characterFormat": { "fontSize": 18, "fontFamily": "Calibri", "fontSizeBidi": 18, "fontFamilyBidi": "Calibri" }, "inlines": [{ "characterFormat": { "fontSize": 18, "fontFamily": "Calibri", "fontSizeBidi": 18, "fontFamilyBidi": "Calibri" }, "text": "Adventure Works Cycles" }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\f" }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "styleName": "Hyperlink", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "styleName": "Hyperlink", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }] }, "evenFooter": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageHeader": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": " HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "underline": "Single", "fontColor": "#0563c1" }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "styleName": "Hyperlink", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }] }, "firstPageFooter": { "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "styleName": "Hyperlink", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": "HYPERLINK \"http://google.com\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "styleName": "Hyperlink", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "text": "click" }, { "characterFormat": {}, "fieldType": 1 }] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Times New Roman", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#00000000", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Times New Roman", "allCaps": false }, "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2013", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 8, "lineSpacing": 1.149999976158142, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri", "fontColor": "#00000000", "fontFamilyBidi": "Calibri" }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 12, "afterSpacing": 0, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2E74B5FF", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "next": "Normal" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": { "fontColor": "#00000000" } }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763FF", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Header", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 234, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "#00000000" }, "basedOn": "Normal", "link": "Header Char", "next": "Header" }, { "name": "Header Char", "type": "Character", "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "basedOn": "Default Paragraph Font" }, { "name": "Footer", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "tabs": [{ "position": 234, "deletePosition": 0, "tabJustification": "Center", "tabLeader": "None" }, { "position": 468, "deletePosition": 0, "tabJustification": "Right", "tabLeader": "None" }] }, "characterFormat": { "fontColor": "#00000000" }, "basedOn": "Normal", "link": "Footer Char", "next": "Footer" }, { "name": "Footer Char", "type": "Character", "characterFormat": { "fontSize": 11, "fontFamily": "Calibri", "fontColor": "#00000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "basedOn": "Default Paragraph Font" }, { "name": "List Paragraph", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 36, "listFormat": {}, "contextualSpacing": true }, "characterFormat": { "fontColor": "#00000000" }, "basedOn": "Normal", "next": "List Paragraph" }, { "name": "Hyperlink", "type": "Character", "characterFormat": { "underline": "Single", "fontColor": "#0000FFFF" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [], "revisions": [], "customXml": [], "footnotes": { "separator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "#00000000" }, "inlines": [{ "characterFormat": { "fontColor": "#00000000" }, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "#00000000" }, "inlines": [{ "characterFormat": { "fontColor": "#00000000" }, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "#00000000" }, "inlines": [{ "characterFormat": { "fontColor": "#00000000" }, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontColor": "#00000000" }, "inlines": [{ "characterFormat": { "fontColor": "#00000000" }, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } };
		editor.open(JSON.stringify(text));
		editor.selection.select('0;H;1;1;38', '0;H;1;1;38');
		expect(editor.editor.onEnter()).not.toThrowError;
	});
});
describe('Resolve the table insertion in 2003 compatibilityMode', () => {
	let editor: DocumentEditor = undefined;
	beforeAll(() => {
		document.body.innerHTML = '';
		let ele: HTMLElement = createElement('div', { id: 'container' });
		document.body.appendChild(ele);
		editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true, height: "800px" });
		editor = new DocumentEditor({ isReadOnly: false, height: "800px" });
		editor.enableAllModules();
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
		setTimeout(() => {
			done();
		}, 1000);
	});
	it('Resolve the table insertion in 2003 compatibilityMode', () => {
		console.log("Resolve the table insertion in 2003 compatibilityMode");
		let text: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false, "pageNumberStyle": "Arabic" }, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello" }, { "characterFormat": {}, "text": "hellohellohell" }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "o" }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohello" }, { "characterFormat": {}, "text": "hellohellohellohellohellohello" }, { "characterFormat": {}, "text": "hellohellohellohellohellohellohellohellohellohellohellohello" }, { "characterFormat": {}, "text": "hellohellohellohellohellohellohellohellohello" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#00000000", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false }, "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 0, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "ReadOnly", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2003", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [], "revisions": [], "customXml": [] };
		editor.open(JSON.stringify(text));
		editor.selection.select('0;1;0', '0;1;0');
		expect(editor.editor.insertTable(2, 2)).not.toThrowError;
	});
});
describe('Curly braces preservation', () => {
	let editor: DocumentEditor = undefined;
	beforeAll(() => {
		document.body.innerHTML = '';
		let ele: HTMLElement = createElement('div', { id: 'container' });
		document.body.appendChild(ele);
		editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true, enableWordExport: true, enableSfdtExport: true, height: "800px" });
		editor = new DocumentEditor({ isReadOnly: false, height: "800px" });
		editor.enableAllModules();
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
		setTimeout(() => {
			done();
		}, 1000);
	});
	it('Curly braces preservation', () => {
		console.log('Curly braces preservation');
		editor.openBlank();
		editor.documentHelper.selection.paragraphFormat.bidi = true;
		editor.documentHelper.selection.characterFormat.bidi = true;
		editor.editor.insertText('{بليبلثقلثقل}');
		expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0].characterFormat.bidi).toBe(true);
		expect(editor.documentHelper.selection.startOffset).toBe('0;0;13');
	});
});