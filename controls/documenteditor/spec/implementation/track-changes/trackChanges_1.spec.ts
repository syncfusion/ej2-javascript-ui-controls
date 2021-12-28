import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../test-helper.spec";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { Editor } from "../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
describe('cut copy paste with Track changes', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
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
    it('Copy text when trackchange is enabled and paste when trackchange disabled(local clipboard)', function () {
console.log('Copy text when trackchange is enabled and paste when trackchange disabled(local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.selection.copy();
        container.enableTrackChanges = false;
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Copy and paste text when track change is disabled (local clipboard)', function () {
console.log('Copy and paste text when track change is disabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Copy and paste text when track change is enabled (local clipboard)', function () {
console.log('Copy and paste text when track change is enabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Copy when trackchange disabled and paste text when track change is enabled (local clipboard)', function () {
console.log('Copy when trackchange disabled and paste text when track change is enabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableTrackChanges = true;
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Cut text when trackchange is enabled and paste when trackchange disabled(local clipboard)', function () {
console.log('Cut text when trackchange is enabled and paste when trackchange disabled(local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.editor.cut();
        container.enableTrackChanges = false;
        container.selection.moveToParagraphEnd();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Cut and paste text when track change is disabled (local clipboard)', function () {
console.log('Cut and paste text when track change is disabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableLocalPaste = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.enableTrackChanges = false;
        container.editor.cut();
        container.selection.handleEndKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Cut and paste text when track change is enabled (local clipboard)', function () {
console.log('Cut and paste text when track change is enabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableLocalPaste = false;
        container.editor.insertText('Hello worlding');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.editor.insertText('World');
        container.selection.selectAll();
        container.editor.cut();
        container.selection.moveToParagraphEnd();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Cut when trackchange disabled and paste text when track change is enabled (local clipboard)', function () {
console.log('Cut when trackchange disabled and paste text when track change is enabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableLocalPaste = false;
        container.enableLocalPaste = true;
        container.editor.insertText('Hellllo');
        container.enableTrackChanges = true;
        container.selection.moveToParagraphStart();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.editor.delete();
        container.selection.moveToParagraphEnd();
        container.editor.insertText('Hello world');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.selectAll();
        container.editor.cut();
        container.selection.moveToParagraphEnd();
        container.enableTrackChanges = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Copy text when trackchange is enabled and paste when trackchange disabled(local clipboard) with new author', function () {
console.log('Copy text when trackchange is enabled and paste when trackchange disabled(local clipboard) with new author');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.selection.selectAll();
        container.selection.copy();
        container.enableTrackChanges = false;
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Copy and paste text when track change is disabled (local clipboard) with new author', function () {
console.log('Copy and paste text when track change is disabled (local clipboard) with new author');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.enableTrackChanges = false;
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Copy and paste text when track change is enabled (local clipboard) with new author', function () {
console.log('Copy and paste text when track change is enabled (local clipboard) with new author');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableLocalPaste = true;
        container.currentUser = "user2";
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Copy when trackchange disabled and paste text when track change is enabled (local clipboard) with new author', function () {
console.log('Copy when trackchange disabled and paste text when track change is enabled (local clipboard) with new author');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.enableTrackChanges = false;
        container.selection.selectAll();
        container.selection.copy();
        container.selection.handleRightKey();
        container.enableTrackChanges = true;
        container.enableLocalPaste = true;
        container.currentUser = "user2";
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Cut and paste text when track change is disabled (local clipboard)', function () {
console.log('Cut and paste text when track change is disabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.selection.selectAll();
        container.enableTrackChanges = false;
        container.editor.cut();
        container.selection.handleEndKey();
        container.enableLocalPaste = true;
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Cut when trackchange disabled and paste text when track change is enabled (local clipboard)', function () {
console.log('Cut when trackchange disabled and paste text when track change is enabled (local clipboard)');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText('Hello ');
        container.enableTrackChanges = true;
        container.currentUser = "user1";
        container.editor.insertText('World');
        container.enableTrackChanges = false;
        container.editor.insertText('welcome');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.enableTrackChanges = true;
        container.editor.delete();
        container.selection.selectAll();
        container.enableTrackChanges = false;
        container.editor.cut();
        container.selection.moveToParagraphEnd();
        container.enableTrackChanges = true;
        container.enableLocalPaste = true;
        container.currentUser = "user2";
        container.editor.paste();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
});

describe('Field result text with multiple lines', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        }, 1000);
    });

    it('Field result text with multiple lines Validation', () => {
        editor.enableTrackChanges = true;
        expect(() => { editor.editor.insertField("MERGEFIELD " + "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational " + " * MERGEFORMAT", "Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational "); }).not.toThrowError();
     });
});
let trackData: any = {
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
				"bidi": false
			},
			"blocks": [
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				},
				{
					"paragraphFormat": {
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
				"listFormat": {}
			},
			"characterFormat": {},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
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
}
describe('Track changes validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        }, 1000);
    });

    it('track changes Validation', () => {
        editor.open(JSON.stringify(trackData));
        editor.enableTrackChanges = true;
        editor.editor.insertText('test1');
        editor.selection.moveDown();
        editor.editor.insertText('test2');
        editor.selection.moveToLineStart();
        editor.editor.handleBackKey();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
     });
});