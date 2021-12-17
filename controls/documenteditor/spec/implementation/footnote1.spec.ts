import { DocumentEditor } from '../../src/document-editor/document-editor';
import { DocumentHelper } from '../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { WordExport } from '../../src/document-editor/implementation/writer/word-export';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
import { BlockContainer, BlockWidget, BodyWidget, FootNoteWidget } from '../../src';


describe('Footnotes validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert Footnote enter text after backspace validation', () => {
        console.log('Insert Footnote enter text after backspace validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one');
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.insertText('two');
        let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
        expect(body.childWidgets.length).toBe(1);
      });
    it('Insert Footnote validation', () => {
        console.log('Insert Footnote validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one');
        editor.editor.handleEnterKey();
        let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
        expect((body.childWidgets[0] as BlockWidget).y < (body.childWidgets[1] as BlockWidget).y).toBe(true);
      });
    it('Insert Footnote enter validation', () => {
        console.log('Insert Footnote enter validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one');
        editor.editor.handleEnterKey();
        editor.editor.insertText('two');
        editor.editor.handleEnterKey();
        editor.editor.insertText('three');
        editor.editor.handleEnterKey();
        editor.editor.insertText('four');
        let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
        expect((body.childWidgets[2] as BlockWidget).y < (body.childWidgets[3] as BlockWidget).y).toBe(true);
      });
    it('Insert Footnote backspace validation', () => {
        console.log('Insert Footnote backspace validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one');
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        editor.editor.handleBackKey();
        let body: FootNoteWidget = (editor.documentHelper.pages[0].footnoteWidget);
        expect(() => { documentHelper.layout.layoutfootNote(body); }).not.toThrowError();
      });
});
let open: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 595.3499755859375,
				"pageHeight": 842,
				"leftMargin": 70.8499984741211,
				"rightMargin": 70.8499984741211,
				"topMargin": 90.69999694824219,
				"bottomMargin": 56.70000076293945,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"headerDistance": 39.70000076293945,
				"footerDistance": 22.700000762939454,
				"bidi": false,
				"endnoteNumberFormat": "LowerCaseRoman",
				"footNoteNumberFormat": "Arabic",
				"restartIndexForFootnotes": "DoNotRestart",
				"restartIndexForEndnotes": "DoNotRestart",
				"initialFootNoteNumber": 1,
				"initialEndNoteNumber": 1
			},
			"blocks": [
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"styleName": "Footnote Reference"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {},
									"inlines": [
										{
											"characterFormat": {
												"styleName": "Footnote Reference"
											},
											"text": "1"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "Sdfsdfsdgsd"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "gs"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "gds"
										},
										{
											"characterFormat": {},
											"text": " df "
										},
										{
											"characterFormat": {},
											"text": "shdfgsjhd"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "gfsjh"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "fka"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "fgg"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "asfasjhfgsdfj"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "hsgf"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "sdhadf"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "gsdaf"
										},
										{
											"characterFormat": {},
											"text": " "
										}
									]
								},
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {},
									"inlines": []
								}
							],
							"symbolCode": 0
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "na"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "nowe"
						},
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"styleName": "Footnote Reference"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {},
									"inlines": [
										{
											"characterFormat": {
												"styleName": "Footnote Reference"
											},
											"text": "2"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "dfdgf"
										}
									]
								}
							],
							"symbolCode": 0
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dgf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gdf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						},
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"styleName": "Footnote Reference"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {},
									"inlines": [
										{
											"characterFormat": {
												"styleName": "Footnote Reference"
											},
											"text": "3"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "dfgdfgdfgdf"
										}
									]
								}
							],
							"symbolCode": 0
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "fgfh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hdf"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "ghfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hgf"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hdf"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "ghgf"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hdgh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "ghdfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hgf"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hdfghfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfghfdgh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " f "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfghfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfgh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "fghdfgh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "fdgh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "fdh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "fg"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " "
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "hfh"
						},
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": " f"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "#000000FF"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "d"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dgf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gdf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dgf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gdf"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						},
						{
							"footnoteType": "Footnote",
							"characterFormat": {
								"styleName": "Footnote Reference"
							},
							"blocks": [
								{
									"paragraphFormat": {
										"styleName": "Footnote Text",
										"listFormat": {}
									},
									"characterFormat": {},
									"inlines": [
										{
											"characterFormat": {
												"styleName": "Footnote Reference"
											},
											"text": "\u0002"
										},
										{
											"characterFormat": {},
											"text": " "
										},
										{
											"characterFormat": {},
											"text": "ddfgdfgdfgdfhhdfh"
										}
									]
								}
							],
							"symbolCode": 0
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Gd"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "F"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "D"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Fg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Dfg"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "Df"
						}
					]
				},
				{
					"paragraphFormat": {
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontFamilyBidi": "Arial"
					},
					"inlines": [
						{
							"characterFormat": {
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontFamilyBidi": "Arial"
							},
							"text": "G"
						}
					]
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
								"textAlignment": "Right",
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAArCAYAAAA9pAX3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAieSURBVGhD7VotbFRZFH5iBQKxgt2+YUlArEAg2ASBQCBIFoEgGwQhTaYznXSm0yltNogKEkgQiAoEAoFAIBAIBKICUVFRUVGBqKhAICoqKioaGEL3++49981795775k23P7sJX3Iy793zc8/97v9rk29JrdVPaq8OIolgP/nlNOL0+kn6HOWv8bxMwfsmZAPPS9R9S9IH+L0pbpWxn5w/1U/O3oDvM4n9EfV8ouB5Fb8vEHuceYhLKWy89KbNp/YKv+uQFcmx8yU5e1lMdVin2v5BREIgibELmj4u6Xo/Gbsu7qVgA2yjtDhFQaP3IG/EVYWQz45UYwwkffc9+e2cuBVxMqRZ4QiREAEQ/CfoH0P6mm9MYP9aQhSAUZhSp/nEBPa7+J2XEANAcWKkUVD/bQmTgYRBx2mo+pSJNrVsvGqjNSI9CWVxVKSxlxgb8gTv7zl1fBsKyrf9tQgNfKDZOrHT0K5pkNxITFckRAGweZz3z4uNkb7BM9fgSI613e/Jud8lXIy0sQlRV0KEtE+iNhhsFuF0+5rUrokZ7GoXteSZOH7nvyRjl8Q0A32gW9DWSY48rU7UsemPSm4QJR22yhFrDI+LNAeUY6cr2kKydQPPq57OxNLIqgL4r4Xx0g2ucWISADbzvo8V4eW4SYOup9iaDeFrkl7xdVZGy8eBU0qLh/qCddSHvgamH4xSIw098ZRDPSacDsZZMOJIW/RtIQvUIamHvo5xsmkxIuCvdFC6IepSwLal+O6Z9VcjbZjQR2IbVCWNdijfCm3tWoSkuCB7uvDcxfrLxK2R8MVhdXg8DTyj+b4UtuEISUs/s5xip505fQeEQT5KGPZucMxAnKeizuDbhGKnM57f+jotXgzIV9lA0MFHRVoVIYn5qQ5iV0K79KGoM4Q2vmSkKWe9MF4MWiefKGk+YQSnjmIX3Bp8m1AsafANbgBaPA32+FH0pZipTwJCZfrATS1damcktgHLwhhxQZ19TllxzwDdgm+LXOyOlQPKzQcBCohW7pEZadrxZskEGQIecRTffXMf1UkbbYvXSCMxEJ62t32dlXSdfhLCAPa3fTuU7ZafqcYmfJ/B9EzHfR3y2cEo+tk4lwD1Brs8yracUpue5ghQFRHSzO7J4wIS5Sedgt7a8JB5/pQJAsRGLP3FJEAZaZwRoa48HkFSSW7oJx8DdNLSdaOsiDLSHFC25NtQYLcoJgYo03Y8XKv00V9GGoH4wRS18dJxMSnAXvfCDYk+2RqMoJHLLL958ZBrPs9ExJ6vqpBGG5Tx/ujb9fPfrXiKZ5lvJ/IWOd2hDRvHRuD9ZWg3IM2OGvWoQyKe8/sabex3O16f9K8hiPFYQpqeDU6+VcUFqkIagYTUyzCSL0wXvmt21aU4Kr8lZ+/qdtUE+RSWETSYvRXt2VIZlTRZ34KNAbZc7LPPQ+x5EPzOt6su4VRGHdpOOlTYDm2nZ88qQ3y4jEoagbqCq42VcI1BWYeE6va6wH5LbSSA5eSW1mkxYa75zgwAI07TNRgGu0ZMDkJa/EtGeB4jOBOgx1oWJw85c2H/wBFWmEYKuKMiFu+oJZ3BP7KM3RKX/y84tb8mv15FY3GW4445NsFndsJBvoK4eHa9c/G4KRQP7j/wAz/wn0a9Xj81PT351/3O5L1ud3LwB5aTRrdbT2c7rau9qfrFR48eZWsUE5bHY8HcXD24l860J6/PdeuXZzuN+Zmp5pWkN90Y77Ubb1Cw7KTXaSz6zn9PTZ2ZbTee5O3w/q433TTf22c6jVsoe9HrND/FZLbTDD41359qXOu1m+vQ7cFmBXV/xvP+bLv5muRJeRiv3Vgt5AJBufHH70P8LuTtjV5yjUHauDnbahX+sn6/07yEPP4gYXMzrT9NoTFmokYaa6YwAjTmaWbbbtyRYgM2EgTsuDhz7foFjhz2lBBeiM0kYLuH8lduRBmiTB2NZfZuRkK7OcEONrFg73LgOxp11+jR2aYD2g1zFCLxzg6+N1hWhl57smfsxT8PS1zramHku+BMSIpUMDlny4SlOIPtVRNnWYoyoKzwJ340com2JEeKDJiYafDU5E0mK8UZ2CiXgxRlsNPc1pPPlR1oDEqA0fuRtuyo/BIRhQt+lKT5QON3aauNAjZeHgOUkUa4Bo9CGkeRs6VwuRFVHAOHYyVtk7Zcn0ZZ8IeR5jAKabB9iZzXMMI/GJ92872o4nDBj5m0rPEkrmx05XHYpHW73dOIuYs1tsN1U/Lp+xtCABec6wzJiIldpK0t38U9Q440sxE44RTkgi1mBkzW7oJZ3dvcTUUdxWGTRrJgs8cTgyPQ+KEeMdHhgtOBDY9LY9vZlpHGnnI+IHpLYgdJ2IW7ueFiQvaGHQ0OmzR2MPLN/ojM2UafoRuCC35U0xPv8xR5LSAgjh2Ho4qoAxwmaXIGK2xGZkaJX+mG4IxGIU2bSjHSCHOajsBMVRxOszxwcBZVgMMkDXk+tzbFg7LzK90QMqNj3Ah8+Gsc30VVwGGRxh0bNjvsINoWhbcku8xENwQX/LhI45TUjhlowB0XPzo6Dok0t1NqB2hezJ0v65PiIpxBfkHU8G9Jc8cKxtH83ZUO+h0pCoAFetHlEBuNRD5XbY1kjpDotdEtF9ENwQUfNkKqkga74G+n7FH689nGCeviscTExzVKigLAL7t7xkYjUZar/WrBPCeL/4ScgxxFjL/LOwPnrFNiKG5KsQrocfEW285ES4oNZE3qOz0qesbKjODSjbINt0sNDpHNl2yQ2cUYG8cT9nDZCIKNPbVDys51sMvOlKxPit3d1sTw77155D9kcLRla5thXL4qZII57PeM/fqA9Qa7Sc7OLKCccnbr5k6Ui6OIm548SJpphnj43UacHejXIPOxKxXLbe/nYmJEkhDfh3lZYqwd6lhiu6zw60dWvhj7sMiOgw1GtRXEfNabbtz4B4jZWC7tnDu0AAAAAElFTkSuQmCC",
									"isMetaFile": false,
									"width": 57.75,
									"height": 32.25,
									"iscrop": false,
									"name": "Picture 1",
									"visible": true,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 0,
									"verticalOrigin": "Margin",
									"verticalAlignment": "None",
									"horizontalPosition": 0,
									"horizontalOrigin": "Margin",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "Inline",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": 2147483647
								}
							]
						}
					]
				},
				"footer": {
					"blocks": [
						{
							"rows": [
								{
									"cells": [
										{
											"blocks": [
												{
													"paragraphFormat": {
														"styleName": "Footer",
														"listFormat": {}
													},
													"characterFormat": {
														"fontSize": 6,
														"fontFamily": "Arial",
														"fontSizeBidi": 6,
														"fontFamilyBidi": "Arial"
													},
													"inlines": [
														{
															"characterFormat": {
																"fontSize": 6,
																"fontFamily": "Arial",
																"fontSizeBidi": 6,
																"fontFamilyBidi": "Arial"
															},
															"text": "Sopockie Towarzystwo Ubezpieczeń ERGO Hestia SA, 81–731 Sopot, ul. Hestii 1, nr KRS 0000024812 (Sąd Rejonowy Gdańsk–Północ w Gdańsku "
														},
														{
															"characterFormat": {
																"fontSize": 6,
																"fontFamily": "Arial",
																"fontSizeBidi": 6,
																"fontFamilyBidi": "Arial"
															},
															"text": "VIII Wydział Gospodarczy KRS), NIP: 585-000-16-90. Kapitał zakładowy opłacony w całości: 196 580 900 zł. Spółka posiada status dużego "
														},
														{
															"characterFormat": {
																"fontSize": 6,
																"fontFamily": "Arial",
																"fontSizeBidi": 6,
																"fontFamilyBidi": "Arial"
															},
															"text": "przedsiębiorcy w rozumieniu ustawy z dnia 8 marca 2013r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych."
														}
													]
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"color": "#000000FF",
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"left": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {
													"backgroundColor": "empty",
													"foregroundColor": "empty",
													"textureStyle": "TextureNone"
												},
												"preferredWidth": 396.8500061035156,
												"preferredWidthType": "Point",
												"cellWidth": 396.8500061035156,
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
														"textAlignment": "Right",
														"styleName": "Footer",
														"listFormat": {}
													},
													"characterFormat": {
														"fontSize": 8,
														"fontFamily": "Arial",
														"fontSizeBidi": 8,
														"fontFamilyBidi": "Arial"
													},
													"inlines": [
														{
															"characterFormat": {
																"fontSize": 8,
																"fontFamily": "Arial",
																"fontSizeBidi": 8,
																"fontFamilyBidi": "Arial"
															},
															"text": "www.ergohestia.pl"
														}
													]
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"color": "#000000FF",
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"left": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {
													"backgroundColor": "empty",
													"foregroundColor": "empty",
													"textureStyle": "TextureNone"
												},
												"preferredWidth": 99.19999694824219,
												"preferredWidthType": "Point",
												"cellWidth": 99.19999694824219,
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
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"gridBefore": 0,
										"gridBeforeWidth": 0,
										"gridBeforeWidthType": "Point",
										"gridAfter": 0,
										"gridAfterWidth": 0,
										"gridAfterWidthType": "Point",
										"leftMargin": 0,
										"topMargin": 5.65,
										"rightMargin": 0,
										"leftIndent": 0
									}
								}
							],
							"grid": [
								396.84999389617669,
								99.1999938967921
							],
							"tableFormat": {
								"borders": {
									"top": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"shading": {},
								"cellSpacing": 0,
								"leftIndent": 0,
								"tableAlignment": "Center",
								"topMargin": 5.650000095367432,
								"rightMargin": 0,
								"leftMargin": 0,
								"bottomMargin": 0,
								"preferredWidth": 496.04998779296877,
								"preferredWidthType": "Point",
								"bidi": false,
								"allowAutoFit": false
							},
							"columnCount": 2
						},
						{
							"paragraphFormat": {
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 1,
								"fontFamily": "Arial",
								"fontSizeBidi": 1,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						}
					]
				},
				"evenHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Header",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"firstPageHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Header",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				}
			}
		}
	],
	"characterFormat": {
		"bold": false,
		"italic": false,
		"fontSize": 11,
		"fontFamily": "Times New Roman",
		"underline": "None",
		"strikethrough": "None",
		"baselineAlignment": "Normal",
		"highlightColor": "NoColor",
		"fontColor": "#00000000",
		"boldBidi": false,
		"italicBidi": false,
		"fontSizeBidi": 11,
		"fontFamilyBidi": "Times New Roman",
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
	"defaultTabWidth": 35.45000076293945,
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
			"characterFormat": {
				"fontSize": 10,
				"fontSizeBidi": 10
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 12,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 16,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
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
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 13,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontSizeBidi": 13,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 35.400001525878909,
				"textAlignment": "Justify",
				"outlineLevel": "Level3",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"fontSize": 12,
				"fontSizeBidi": 12
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "Heading 4",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level4",
				"listFormat": {}
			},
			"characterFormat": {
				"italic": true,
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"italicBidi": true,
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 5",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level5",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#2F5496FF",
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
				"fontColor": "#2F5496FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 6",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 2,
				"lineSpacing": 1.0791666507720948,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level6",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Calibri Light",
				"fontColor": "#1F3763FF",
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
				"fontColor": "#1F3763FF",
				"fontFamilyBidi": "Calibri Light"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 240.89999389648438,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 453.5,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Header"
		},
		{
			"name": "Body Text Indent",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 81.55000305175781,
				"firstLineIndent": -49.650001525878909,
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"fontSize": 11,
				"fontFamily": "Arial",
				"boldBidi": true,
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Body Text Indent"
		},
		{
			"name": "Message Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 42.54999923706055,
				"firstLineIndent": -42.54999923706055,
				"lineSpacing": 9,
				"lineSpacingType": "AtLeast",
				"listFormat": {},
				"keepLinesTogether": true
			},
			"characterFormat": {
				"fontFamily": "Arial",
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Body Text",
			"next": "Message Header"
		},
		{
			"name": "Body Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 6,
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Body Text Char",
			"next": "Body Text"
		},
		{
			"name": "Body Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Body Text Indent 2",
			"type": "Paragraph",
			"paragraphFormat": {
				"firstLineIndent": 28.299999237060548,
				"textAlignment": "Justify",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Body Text Indent 2"
		},
		{
			"name": "Body Text 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Justify",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Body Text 3"
		},
		{
			"name": "Body Text Indent 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"firstLineIndent": 35.400001525878909,
				"textAlignment": "Justify",
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Body Text Indent 3"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 226.8000030517578,
						"deletePosition": 0,
						"tabJustification": "Center",
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
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "Footer"
		},
		{
			"name": "Nagłówek 3 Znak",
			"type": "Character",
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Salutation",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Normal"
		},
		{
			"name": "Zwrot grzecznościowy Znak",
			"type": "Character",
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontColor": "#00000000",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Body Text First Indent",
			"type": "Paragraph",
			"paragraphFormat": {
				"firstLineIndent": 10.5,
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 11,
				"fontFamily": "Arial",
				"fontSizeBidi": 11,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Body Text",
			"next": "Body Text First Indent"
		},
		{
			"name": "Tekst podstawowy z wcięciem Znak",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Body Text Char"
		},
		{
			"name": "annotation reference",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Comment Text Char",
			"next": "annotation text"
		},
		{
			"name": "Comment Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation subject",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			},
			"basedOn": "annotation text",
			"link": "Comment Subject Char",
			"next": "annotation text"
		},
		{
			"name": "Comment Subject Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"boldBidi": true,
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Normal",
			"link": "Balloon Text Char",
			"next": "Balloon Text"
		},
		{
			"name": "Balloon Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontFamily": "Tahoma",
				"fontColor": "#00000000",
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Tekst podstawowy 21",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Justify",
				"lineSpacing": 12,
				"lineSpacingType": "AtLeast",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Arial",
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Tekst podstawowy 21"
		},
		{
			"name": "Footnote Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Footnote Text Char",
			"next": "Footnote Text"
		},
		{
			"name": "Footnote Text Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Hyperlink",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"underline": "Single",
				"fontColor": "#0000FFFF",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footnote Reference",
			"type": "Character",
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"baselineAlignment": "Superscript",
				"fontColor": "#00000000",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri"
			},
			"basedOn": "Normal",
			"next": "List Paragraph"
		}
	],
	"lists": [],
	"abstractLists": [],
	"comments": [],
	"revisions": [],
	"customXml": [],
	"footnotes": {
		"separator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontSize": 9.5,
					"fontSizeBidi": 9.5
				},
				"inlines": [
					{
						"characterFormat": {
							"fontSize": 9.5,
							"fontSizeBidi": 9.5
						},
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"paragraphFormat": {
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontSize": 9.5,
					"fontSizeBidi": 9.5
				},
				"inlines": [
					{
						"characterFormat": {
							"fontSize": 9.5,
							"fontSizeBidi": 9.5
						},
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
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
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('Footnotes selection validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('moving cursor using left arrow validation', () => {
        console.log('moving cursor using left arrow validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one ');
        editor.editor.insertText('one ');
        let index: number = documentHelper.selection.start.offset;
        editor.documentHelper.selection.handleLeftKey();
        editor.documentHelper.selection.handleLeftKey();
        let aftindex: number = documentHelper.selection.start.offset;
        expect(index > aftindex).toBe(true);
      });
      it('moving cursor using right arrow validation', () => {
        console.log('moving cursor using right arrow validation');
        editor.editor.insertFootnote();
        editor.editor.insertText('one ');
        editor.editor.insertText('one ');
        editor.documentHelper.selection.handleLeftKey();
        editor.documentHelper.selection.handleLeftKey();
        let aftindex: number = documentHelper.selection.start.offset;
        editor.documentHelper.selection.handleRightKey();
        editor.documentHelper.selection.handleRightKey();
        let index: number = documentHelper.selection.start.offset;
        expect(index < aftindex).toBe(false);
      });
    //  it('moving footnote validation', () => {
     //   console.log('moving footnote validation');
     //   editor.open(JSON.stringify(open));
     //   editor.editor.handleEnterKey();
     //   let index: number = editor.documentHelper.pages[0].footnoteWidget.bodyWidgets.length
     //   expect(index).toBe(2);
     // });
});
describe('Footnotes validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.appendChild(createElement('div', { id: 'container' }));
        DocumentEditor.Inject(Editor, Selection, WordExport, SfdtExport, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableWordExport: true, enableEditor: true, isReadOnly: false, enableSelection: true, enableSfdtExport: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Insert Footnote with undo redo validation', () => {
        console.log('Insert Footnote with undo redo validation');
        editor.editor.insertFootnote();
		let sfdt: any = editor.serialize();
		editor.editorHistory.undo()
       // let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
        expect(editor.documentHelper.pages[0].footnoteWidget).toBeUndefined();
		let sfdt_AfterUndo: any = editor.serialize();
		editor.editorHistory.redo();
		expect(editor.serialize()).toBe(sfdt);
		for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
            expect(editor.serialize()).toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
      });
    it('Insert Footnote with text undo redo validation', () => {
		editor.editor.insertText("mainbody");
        editor.editor.insertFootnote();
		editor.editor.insertText("test");
		let sfdt: any = editor.serialize();
		editor.editorHistory.undo()
       // let body: BlockContainer = (editor.documentHelper.pages[0].footnoteWidget.bodyWidgets[0] as BodyWidget);
        expect(editor.documentHelper.pages[0].footnoteWidget.bodyWidgets.length).toBe(2);
		let sfdt_AfterUndo: any = editor.serialize();
		editor.editorHistory.redo();
		expect(editor.serialize()).toBe(sfdt);
		for (let i = 0; i <= 3; i++) {
            editor.editorHistory.undo();
			editor.editorHistory.undo();
            expect(editor.serialize()).not.toBe(sfdt_AfterUndo);
            editor.editorHistory.redo();
			editor.editorHistory.redo();
            expect(editor.serialize()).toBe(sfdt);
        }
      });
});