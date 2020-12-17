import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { ParagraphWidget, LineWidget, BlockWidget, FootnoteElementBox } from '../../../src/document-editor/implementation/viewer/page';
import { FootnoteType, WSectionFormat, FootnoteRestartIndex, FootEndNoteNumberFormat } from '../../../src';

let footendNoteJson: any = {
	"sections": [
		{
			"blocks": [
				{
					"characterFormat": {
						"fontColor": "empty"
					},
					"paragraphFormat": {
						"styleName": "Normal"
					},
					"inlines": [
						{
							"text": "Hello",
							"characterFormat": {
								"fontColor": "empty"
							}
						},
						{
							"footnoteType": "Endnote",
							"markerCharacterFormat": {
								"fontColor": "empty",
								"styleName": "Endnote Reference"
							},
							"blocks": [
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"paragraphFormat": {
										"styleName": "Endnote Text"
									},
									"inlines": [
										{
											"text": "\u0002",
											"characterFormat": {
												"fontColor": "empty",
												"styleName": "Endnote Reference"
											}
										},
										{
											"text": " Hello endnote",
											"characterFormat": {
												"fontColor": "empty"
											}
										}
									]
								}
							],
							"symbolCode": 0,
							"symbolFontName": "Symbol"
						},
						{
							"text": " have a nice day",
							"characterFormat": {
								"fontColor": "empty"
							}
						},
						{
							"footnoteType": "Footnote",
							"markerCharacterFormat": {
								"fontColor": "empty",
								"styleName": "Footnote Reference"
							},
							"blocks": [
								{
									"characterFormat": {
										"fontColor": "empty"
									},
									"paragraphFormat": {
										"styleName": "Footnote Text"
									},
									"inlines": [
										{
											"text": "\u0002",
											"characterFormat": {
												"fontColor": "empty",
												"styleName": "Footnote Reference"
											}
										},
										{
											"text": " Nice day endnote",
											"characterFormat": {
												"fontColor": "empty"
											}
										}
									]
								}
							],
							"symbolCode": 0,
							"symbolFontName": "Symbol"
						}
					]
				}
			],
			"headersFooters": {},
			"sectionFormat": {
				"headerDistance": 36.0,
				"footerDistance": 36.0,
				"pageWidth": 612.0,
				"pageHeight": 792.0,
				"leftMargin": 72.0,
				"rightMargin": 72.0,
				"topMargin": 72.0,
				"bottomMargin": 72.0,
				"differentFirstPage": false,
				"differentOddAndEvenPages": false,
				"bidi": false,
				"restartPageNumbering": false,
				"pageStartingNumber": 0,
				"footnotePosition": "PrintImmediatelyBeneathText",
				"endnotePosition": "DisplayEndOfDocument",
				"endnoteNumberFormat": "Arabic",
				"footNoteNumberFormat": "UpperCaseLetter",
				"restartIndexForFootnotes": "RestartForEachPage",
				"restartIndexForEndnotes": "RestartForEachSection"
			}
		}
	],
	"characterFormat": {
		"fontSize": 11.0,
		"fontFamily": "Calibri",
		"fontColor": "empty",
		"fontSizeBidi": 11.0,
		"fontFamilyBidi": "Arial"
	},
	"paragraphFormat": {
		"afterSpacing": 8.0,
		"lineSpacing": 1.0791666507720948,
		"lineSpacingType": "Multiple"
	},
	"background": {
		"color": "#FFFFFFFF"
	},
	"styles": [
		{
			"type": "Paragraph",
			"name": "Normal",
			"next": "Normal",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"type": "Character",
			"name": "Default Paragraph Font",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"type": "Paragraph",
			"name": "Footnote Text",
			"basedOn": "Normal",
			"next": "Footnote Text",
			"link": "Footnote Text Char",
			"characterFormat": {
				"fontSize": 10.0,
				"fontColor": "empty",
				"fontSizeBidi": 10.0
			},
			"paragraphFormat": {
				"afterSpacing": 0.0,
				"lineSpacing": 1.0,
				"lineSpacingType": "Multiple"
			}
		},
		{
			"type": "Character",
			"name": "Footnote Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontColor": "empty",
				"fontSizeBidi": 10.0
			}
		},
		{
			"type": "Character",
			"name": "Footnote Reference",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"baselineAlignment": "Superscript",
				"fontColor": "empty"
			}
		},
		{
			"type": "Paragraph",
			"name": "Endnote Text",
			"basedOn": "Normal",
			"next": "Endnote Text",
			"link": "Endnote Text Char",
			"characterFormat": {
				"fontSize": 10.0,
				"fontColor": "empty",
				"fontSizeBidi": 10.0
			},
			"paragraphFormat": {
				"afterSpacing": 0.0,
				"lineSpacing": 1.0,
				"lineSpacingType": "Multiple"
			}
		},
		{
			"type": "Character",
			"name": "Endnote Text Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontSize": 10.0,
				"fontColor": "empty",
				"fontSizeBidi": 10.0
			}
		},
		{
			"type": "Character",
			"name": "Endnote Reference",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"baselineAlignment": "Superscript",
				"fontColor": "empty"
			}
		},
		{
			"type": "Paragraph",
			"name": "Header",
			"basedOn": "Normal",
			"next": "Header",
			"link": "Header Char",
			"characterFormat": {
				"fontColor": "empty"
			},
			"paragraphFormat": {
				"afterSpacing": 0.0,
				"lineSpacing": 1.0,
				"lineSpacingType": "Multiple",
				"tabs": [
					{
						"tabJustification": "Center",
						"position": 234.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Right",
						"position": 468.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Header Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"type": "Paragraph",
			"name": "Footer",
			"basedOn": "Normal",
			"next": "Footer",
			"link": "Footer Char",
			"characterFormat": {
				"fontColor": "empty"
			},
			"paragraphFormat": {
				"afterSpacing": 0.0,
				"lineSpacing": 1.0,
				"lineSpacingType": "Multiple",
				"tabs": [
					{
						"tabJustification": "Center",
						"position": 234.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					},
					{
						"tabJustification": "Right",
						"position": 468.0,
						"tabLeader": "None",
						"deletePosition": 0.0
					}
				]
			}
		},
		{
			"type": "Character",
			"name": "Footer Char",
			"basedOn": "Default Paragraph Font",
			"characterFormat": {
				"fontColor": "empty"
			}
		}
	],
	"defaultTabWidth": 36.0,
	"formatting": false,
	"trackChanges": false,
	"protectionType": "NoProtection",
	"enforcement": false,
	"dontUseHTMLParagraphAutoSpacing": false,
	"alignTablesRowByRow": false,
	"formFieldShading": true,
	"footnotes": {
		"separator": [
			{
				"characterFormat": {
					"fontColor": "empty"
				},
				"paragraphFormat": {
					"afterSpacing": 0.0,
					"lineSpacing": 1.0,
					"lineSpacingType": "Multiple",
					"styleName": "Normal"
				},
				"inlines": [
					{
						"text": "\u0003",
						"characterFormat": {
							"fontColor": "empty"
						}
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"characterFormat": {
					"fontColor": "empty"
				},
				"paragraphFormat": {
					"afterSpacing": 0.0,
					"lineSpacing": 1.0,
					"lineSpacingType": "Multiple",
					"styleName": "Normal"
				},
				"inlines": [
					{
						"text": "\u0004",
						"characterFormat": {
							"fontColor": "empty"
						}
					}
				]
			}
		]
	},
	"endnotes": {
		"separator": [
			{
				"characterFormat": {
					"fontColor": "empty"
				},
				"paragraphFormat": {
					"afterSpacing": 0.0,
					"lineSpacing": 1.0,
					"lineSpacingType": "Multiple",
					"styleName": "Normal"
				},
				"inlines": [
					{
						"text": "\u0003",
						"characterFormat": {
							"fontColor": "empty"
						}
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"characterFormat": {
					"fontColor": "empty"
				},
				"paragraphFormat": {
					"afterSpacing": 0.0,
					"lineSpacing": 1.0,
					"lineSpacingType": "Multiple",
					"styleName": "Normal"
				},
				"inlines": [
					{
						"text": "\u0004",
						"characterFormat": {
							"fontColor": "empty"
						}
					}
				]
			}
		]
	}
};

describe('Content Control Validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let blocks: BlockWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(footendNoteJson);
        blocks = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as ParagraphWidget[];
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Inline footnote', () => {
        console.log('Inline footnote');
        let footnoteTypes: FootnoteType = 'Endnote';
        let code: any = 0;
        expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).footnoteType).toBe(footnoteTypes);
        expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).symbolFontName).toBe('Symbol');
        expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).symbolCode).toBe(code);
        expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).customMarker).toBe(undefined);
        expect(((blocks[0].childWidgets[0] as LineWidget).children[1] as FootnoteElementBox).blocks.length >= 1).toBe(true)        
    });
    it('footnote in section format', () => {
        console.log('footnote in section format');
        let section: WSectionFormat = editor.documentHelper.pages[0].bodyWidgets[0].sectionFormat;
        let endNoteFormat: FootEndNoteNumberFormat= 'Arabic';
        let footNoteFormat: FootEndNoteNumberFormat= 'UpperCaseLetter';
        let endNoteRestartIndex: FootnoteRestartIndex= 'RestartForEachSection';
        let footNoteRestartIndex: FootnoteRestartIndex= 'RestartForEachPage';
        expect(section.endnoteNumberFormat).toBe(endNoteFormat);
        expect(section.footNoteNumberFormat).toBe(footNoteFormat);
        expect(section.restartIndexForEndnotes).toBe(endNoteRestartIndex);
        expect(section.restartIndexForFootnotes).toBe(footNoteRestartIndex);
    });
    it('footnote in document', () => {
        expect(editor.documentHelper.footnotes.continuationSeparator.length >= 1).toBe(true);
        expect(editor.documentHelper.footnotes.separator.length >= 1).toBe(true);
    });
    it('endnotes in document', () => {
        expect(editor.documentHelper.endnotes.continuationSeparator.length >= 1).toBe(true);
        expect(editor.documentHelper.endnotes.separator.length >= 1).toBe(true);
    });
});