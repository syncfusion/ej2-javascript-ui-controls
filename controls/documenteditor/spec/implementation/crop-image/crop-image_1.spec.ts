import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../test-helper.spec";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { SfdtExport } from '../../../src/document-editor/implementation/writer/sfdt-export';
import { DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';

import { ImageElementBox } from "../../../src";

let croppedImage:any = {
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
				"footerDistance": 47.29999923706055,
				"bidi": false
			},
			"blocks": [
				{
					"paragraphFormat": {
						"firstLineIndent": 27,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				},
				{
					"paragraphFormat": {
						"firstLineIndent": 27,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 10,
						"fontFamily": "Arial",
						"fontColor": "#000000FF",
						"fontSizeBidi": 10,
						"fontFamilyBidi": "Arial"
					},
					"inlines": []
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABUYAAAI4CAMAAACREMNsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAXEQAAFxEByibzPwAAAAd0SU1FB9sEDAwgEIpSkpYAAAAkdEVYdFNvZnR3YXJlAEFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93c9hUJBYAAACNUExURQBFkxVOmy1Yo11ss0VhqmVqb25zd29zeHZ7gHh9gml2uX+EiXaAv5GWmoiNkYuPlJSZnYKHi5ufpI+Vy4OKxZ6jp52h0aSorLe6vq2xtamssLO3uqqt17e53b3BxNTW2crN0MHEx9zd39LU18jKzcXG5NPT6t7f4f39/eDg8O/u9ujq6/Lz9Ofo6fHy84S4XNYAACM/SURBVHja7d0JV6PK2rDhOFQQtQWMsTUo0ZAoDvD/f96hBqY4tLsfYoPnvtb6uhNN4v7s99yroKBqkgEABCb8CgBAgowCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIwCgAgZBQARMgoAImQUAETIKACIkFEAECGjACBCRgFAhIx+o6fNzWx2emDMZrPNhl8J8AOQ0e/xdHNxMHlr/3hGS4GRI6Pf4PZif/KJg8snfkfAeJHRXduc7k3+6PDymd8UMFJkdKeeL7vj0IOD45lxerB9jH/M0T0wTmR0h54umoHo/unlZmvE+by5PD1sD0lv+JUBI0RGd+b5ourj3vHNU/awmc0u7Cz9xWy2eaheddM66N8npMD4kNFdmVV1PL59uumMOqvB5+mla+ntaXPUz6E9MDZkdDc27pzo/uXN6SfT9Punt+blrXOop0w2AeNCRnehOp7fv/jzNP3eqR2T3lQD1r1bfoHAmJDRHXBD0f2Dw8mXuLmlm30GpMAIkdH+zeygcn9/8mVubunSjV0PH/gtAqNBRvv2fDz5Gzak1Zv3mLIH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",
									"isMetaFile": false,
									"width": 546.6,
									"height": 112.44998000000001,
									"iscrop": true,
									"bottom": 28.058000564575197,
									"right": 0,
									"left": 11.33899974822998,
									"top": 28.54199981689453,
									"getimagewidth": 1350,
									"getimageheight": 568,
									"name": "Picture 1",
									"title": "WFS-01",
									"visible": true,
									"widthScale": 53.985184,
									"heightScale": 26.39671,
									"verticalPosition": -43.7,
									"verticalOrigin": "Paragraph",
									"verticalAlignment": "None",
									"horizontalPosition": -52.9,
									"horizontalOrigin": "Column",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "Square",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": -1
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8.5,
								"fontFamily": "Arial",
								"fontColor": "#6A737BFF",
								"fontSizeBidi": 8.5,
								"fontFamilyBidi": "Arial"
							},
							"inlines": []
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "World Fuel Services, Corp"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": ". "
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "9800 NW 41"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"baselineAlignment": "Superscript",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "st"
								},
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": " Street"
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "Suite 400"
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "Miami, FL 33178"
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "+1 305 428 8000"
								}
							]
						},
						{
							"paragraphFormat": {
								"firstLineIndent": 27,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 8,
								"fontFamily": "Arial",
								"fontColor": "#000000FF",
								"fontSizeBidi": 8,
								"fontFamilyBidi": "Arial"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontSize": 8,
										"fontFamily": "Arial",
										"fontColor": "#000000FF",
										"fontSizeBidi": 8,
										"fontFamilyBidi": "Arial"
									},
									"text": "www.wfscorp.com"
								}
							]
						},
						{
							"paragraphFormat": {
								"rightIndent": 18,
								"textAlignment": "Right",
								"styleName": "Header",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 10,
								"fontFamily": "Arial",
								"fontSizeBidi": 10,
								"fontFamilyBidi": "Arial"
							},
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
	"defaultTabWidth": 24,
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
				"listFormat": {},
				"widowControl": false
			},
			"characterFormat": {
				"fontSize": 12,
				"fontSizeBidi": 12
			},
			"next": "Normal"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 9,
				"fontFamily": "Arial",
				"fontSizeBidi": 9,
				"fontFamilyBidi": "Arial"
			},
			"basedOn": "Normal",
			"next": "Balloon Text"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 216,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 432,
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
			"name": "Page Number",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"tabs": [
					{
						"position": 216,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 432,
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
			"name": "Normal (Web)",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Justify",
				"afterSpacing": 10.5,
				"lineSpacing": 10.5,
				"lineSpacingType": "AtLeast",
				"listFormat": {},
				"widowControl": true
			},
			"characterFormat": {
				"fontSize": 8.5,
				"fontSizeBidi": 8.5
			},
			"basedOn": "Normal",
			"next": "Normal (Web)"
		},
		{
			"name": "Strong",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"boldBidi": true
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Hyperlink",
			"type": "Character",
			"characterFormat": {
				"underline": "Single",
				"fontColor": "#0000FFFF"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Calibri",
				"fontColor": "#000000FF",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Calibri"
			},
			"next": "Default"
		},
		{
			"name": "No Spacing",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {},
				"widowControl": false
			},
			"characterFormat": {
				"fontSize": 12,
				"fontSizeBidi": 12
			},
			"next": "No Spacing"
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
	"customXml": [],
	"footnotes": {
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
		]
	}
};
describe('cropped image validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(SfdtExport);
        editor = new DocumentEditor({ enableSfdtExport: true });
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
	it("cropped image validation",()=>{
		console.log("cropped image validation");
		editor.openBlank();
		editor.open(JSON.stringify(croppedImage));
		let ImageElement: ImageElementBox = editor.documentHelper.pages[0].headerWidget.floatingElements[0] as ImageElementBox;
		expect(ImageElement.isCrop).toBe(true);
		expect(ImageElement.cropX).toBe(153.07649660110474);
		expect(ImageElement.cropY).toBe(162.11855895996095);
		expect(ImageElement.cropWidth).toBe(1196.9235033988953);
		expect(ImageElement.cropHeight).toBe(246.51199783325194);
	});
});