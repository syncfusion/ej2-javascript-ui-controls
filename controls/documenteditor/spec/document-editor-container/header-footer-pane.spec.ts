import { DocumentEditorContainer } from '../../src/document-editor-container/document-editor-container';
import { Toolbar } from '../../src/document-editor-container/tool-bar/tool-bar';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor} from '../../src/document-editor/document-editor';
import {Selection} from '../../src/document-editor/implementation/selection/selection';
import { Editor } from "../../src/document-editor/implementation/editor/editor";
import { EditorHistory } from "../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../src/document-editor/implementation/writer/sfdt-export";
import { TestHelper } from "../test-helper.spec";
/**
 * Document Editor container
 */

describe('Show hide header footer pane', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: true });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Navigate to header and check pane display', () => {
console.log('Navigate to header and check pane display');
        container.documentEditor.selection.goToHeader();
       expect(container.documentEditor.enableHeaderAndFooter).toBe(true);
    });
    it('Properties pane enable disable click function', () => {
console.log('Properties pane enable disable click function');
        (container.toolbarModule as any).showHidePropertiesPane();
        expect(container.documentEditor.enableHeaderAndFooter).toBe(true);
    });
    it('Close header pane and check pane', () => {
console.log('Close header pane and check pane');
        (container.toolbarModule as any).showHidePropertiesPane();
        (container.headerFooterProperties as any).onClose();
        expect(container.documentEditor.enableHeaderAndFooter).toBe(false);
    });

});

describe('Show hide FormFiedld Validation In Header and Footer', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ showPropertiesPane: false });
        container.appendTo(element);
    });
    afterAll(() => {
        container.destroy();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        expect(() => { container.destroy(); }).not.toThrowError();
        document.body.innerHTML = '';
        element = undefined;
        container = undefined;
    });
    it('Navigate to header and FormFiedld Validation ', () => {
        let editor: DocumentEditor = container.documentEditor;
        editor.selection.goToHeader();
        editor.editor.insertFormField("Text");
        expect(editor.documentHelper.formFields.length).toBe(0);

    });

});
let text: any ={
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 595.2999877929688,
				"pageHeight": 841.9000244140625,
				"leftMargin": 68.05000305175781,
				"rightMargin": 68.05000305175781,
				"topMargin": 68.05000305175781,
				"bottomMargin": 68.05000305175781,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 35.45000076293945,
				"footerDistance": 35.45000076293945,
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
				},
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
				},
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
				},
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
				},
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
				},
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
				},
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
				},
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
				},
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
				},
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
						"listFormat": {},
						"tabs": [
							{
								"position": 341,
								"deletePosition": 0,
								"tabJustification": "Left",
								"tabLeader": "None"
							}
						]
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"imageString": "data:image/png;base64,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",
							"isMetaFile": false,
							"width": 78.5,
							"height": 39.65,
							"iscrop": false,
							"name": "Picture 9",
							"alternativeText": "NSW Government Justice logo",
							"visible": true,
							"widthScale": 27.328112,
							"heightScale": 32.040405,
							"verticalPosition": 633,
							"verticalOrigin": "Page",
							"verticalAlignment": "None",
							"horizontalPosition": 438.5,
							"horizontalOrigin": "Page",
							"horizontalAlignment": "None",
							"allowOverlap": true,
							"textWrappingStyle": "Square",
							"textWrappingType": "Both",
							"layoutInCell": true,
							"zOrderPosition": 251659264
						},
						{
							"characterFormat": {},
							"text": "\t"
						}
					]
				}
			],
			"headersFooters": {
				"header": {
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
				"footer": {
					"blocks": [
						{
							"paragraphFormat": {
								"textAlignment": "Center",
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": "Corrective Services NSW | Community Corrections | Page "
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"fieldType": 0,
									"hasFieldEnd": true
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": " PAGE  \\* Arabic  \\* MERGEFORMAT "
								},
								{
									"characterFormat": {},
									"fieldType": 2
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": "6"
								},
								{
									"characterFormat": {},
									"fieldType": 1
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": " of "
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"fieldType": 0,
									"hasFieldEnd": true
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": " NUMPAGES  \\* Arabic  \\* MERGEFORMAT "
								},
								{
									"characterFormat": {},
									"fieldType": 2
								},
								{
									"characterFormat": {
										"fontColor": "#002060FF"
									},
									"text": "1"
								},
								{
									"characterFormat": {},
									"fieldType": 1
								}
							]
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
							"inlines": [
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,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",
									"isMetaFile": false,
									"width": 91.8,
									"height": 39.65,
									"iscrop": false,
									"name": "Picture 3",
									"alternativeText": "NSW Government Justice logo",
									"visible": true,
									"widthScale": 31.958225,
									"heightScale": 32.040405,
									"verticalPosition": 28.95,
									"verticalOrigin": "Page",
									"verticalAlignment": "None",
									"horizontalPosition": 443.95,
									"horizontalOrigin": "Page",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "Square",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": 251657728
								},
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACP8AAAPJCAYAAABnAB+iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAMfhJREFUeNrs3TuOHlUURtE2cg+AGHKTkjAWckTCsCAhJmQyxJ4BImk4ICNj/Ojuv167aq3k6KZfvKX78uHh4Q4AAAAAAADgxY+//WIFAGj5zAQAAAAAAAAAANAk/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIfAAAAAAAAAACIEv8AAAAAAAAAAECU+AcAAAAAAAAAAKLEPwAAAAAAAAAAECX+AQAAAAAAAACAKPEPAAAAAAAAAABEiX8AAAAAAAAAACBK/AMAAAAAAAAAAFHiHwAAAAAAAAAAiBL/AAAAAAAAAABAlPgHAAAAAAAAAACixD8AAAAAAAAAABAl/gEAAAAAAAAAgCjxDwAAAAAAAAAARIl/AAAAAAAAAAAgSvwDAAAAAAAAAABR4h8AAAAAAAAAAIgS/wAAAAAAAAAAQJT4BwAAAAAAAAAAosQ/AAAAAAAAAAAQJf4BAAAAAAAAAIAo8Q8AAAAAAAAAAESJfwAAAAAAAAAAIEr8AwAAAAAAAAAAUeIf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",
									"isMetaFile": false,
									"width": 567.75006,
									"height": 236.25,
									"iscrop": false,
									"name": "Picture 4",
									"alternativeText": "Department of Justice header graphic element",
									"visible": true,
									"widthScale": 32.87017,
									"heightScale": 32.50774,
									"verticalPosition": -0.75,
									"verticalOrigin": "Page",
									"verticalAlignment": "None",
									"horizontalPosition": -16.5,
									"horizontalOrigin": "Page",
									"horizontalAlignment": "None",
									"allowOverlap": true,
									"textWrappingStyle": "Square",
									"textWrappingType": "Both",
									"layoutInCell": true,
									"zOrderPosition": 251656704
								},
								{
									"characterFormat": {},
									"shapeId": 1,
									"name": "Text Box 2",
									"visible": true,
									"width": 359.7,
									"height": 119.6,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 50.55,
									"verticalOrigin": "Paragraph",
									"verticalAlignment": "None",
									"verticalRelativePercent": -3.4028235e38,
									"horizontalPosition": 67.85,
									"horizontalOrigin": "Page",
									"horizontalAlignment": "None",
									"horizontalRelativePercent": -3.4028235e38,
									"zOrderPosition": 251658752,
									"allowOverlap": true,
									"textWrappingStyle": "InFrontOfText",
									"textWrappingType": "Both",
									"distanceBottom": 0,
									"distanceLeft": 9,
									"distanceRight": 9,
									"distanceTop": 0,
									"layoutInCell": true,
									"lockAnchor": false,
									"autoShapeType": "Rectangle",
									"fillFormat": {
										"color": "#FFFFFFFF",
										"fill": false
									},
									"lineFormat": {
										"lineFormatType": "None",
										"color": "#000000FF",
										"weight": 1,
										"lineStyle": "Solid",
										"line": false
									},
									"textFrame": {
										"textVerticalAlignment": "Middle",
										"leftMargin": 6.37795,
										"rightMargin": 5.4,
										"topMargin": 2.7,
										"bottomMargin": 2.7,
										"blocks": [
											{
												"paragraphFormat": {
													"leftIndent": -9.050000190734864,
													"lineSpacing": 1,
													"lineSpacingType": "Multiple",
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {
													"bold": true,
													"fontSize": 36,
													"fontColor": "#FFFFFFFF",
													"boldBidi": true,
													"fontSizeBidi": 36
												},
												"inlines": []
											},
											{
												"paragraphFormat": {
													"leftIndent": -9.050000190734864,
													"lineSpacing": 1,
													"lineSpacingType": "Multiple",
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {
													"bold": true,
													"fontSize": 24,
													"fontColor": "#FFFFFFFF",
													"boldBidi": true,
													"fontSizeBidi": 24
												},
												"inlines": [
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 24,
															"fontColor": "#FFFFFFFF",
															"boldBidi": true,
															"fontSizeBidi": 24
														},
														"text": "Pre-"
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 24,
															"fontColor": "#FFFFFFFF",
															"boldBidi": true,
															"fontSizeBidi": 24
														},
														"text": "release "
													},
													{
														"characterFormat": {
															"bold": true,
															"fontSize": 24,
															"fontColor": "#FFFFFFFF",
															"boldBidi": true,
															"fontSizeBidi": 24
														},
														"text": "report"
													}
												]
											},
											{
												"paragraphFormat": {
													"leftIndent": -9.050000190734864,
													"lineSpacing": 1,
													"lineSpacingType": "Multiple",
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {
													"fontSize": 20,
													"fontColor": "#FFFFFFFF",
													"fontSizeBidi": 20
												},
												"inlines": []
											},
											{
												"paragraphFormat": {
													"firstLineIndent": -9.050000190734864,
													"lineSpacing": 1,
													"lineSpacingType": "Multiple",
													"styleName": "Normal",
													"listFormat": {}
												},
												"characterFormat": {
													"fontSize": 20,
													"fontColor": "#FFFFFFFF",
													"fontSizeBidi": 20
												},
												"inlines": []
											}
										]
									}
								}
							]
						}
					]
				},
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
								"textAlignment": "Center",
								"styleName": "Footer",
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": [
								{
									"characterFormat": {},
									"shapeId": 8,
									"name": "Rectangle 8",
									"visible": true,
									"width": 236.5,
									"height": 46.5,
									"widthScale": 100,
									"heightScale": 100,
									"verticalPosition": 95.55,
									"verticalOrigin": "Paragraph",
									"verticalAlignment": "None",
									"verticalRelativePercent": -3.4028235e38,
									"horizontalPosition": 69.45,
									"horizontalOrigin": "Column",
									"horizontalAlignment": "None",
									"horizontalRelativePercent": -3.4028235e38,
									"zOrderPosition": 251659776,
									"allowOverlap": true,
									"textWrappingStyle": "InFrontOfText",
									"textWrappingType": "Both",
									"distanceBottom": 0,
									"distanceLeft": 9,
									"distanceRight": 9,
									"distanceTop": 0,
									"layoutInCell": true,
									"lockAnchor": false,
									"autoShapeType": "Rectangle",
									"fillFormat": {
										"color": "#4472C4FF",
										"fill": true
									},
									"lineFormat": {
										"lineFormatType": "Solid",
										"color": "#2F528FFF",
										"weight": 1,
										"lineStyle": "Solid",
										"line": true
									},
									"textFrame": {
										"textVerticalAlignment": "Middle",
										"leftMargin": 5.4,
										"rightMargin": 5.4,
										"topMargin": 2.7,
										"bottomMargin": 2.7,
										"blocks": [
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
								},
								{
									"characterFormat": {},
									"imageString": "data:image/png;base64,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",
									"isMetaFile": false,
									"width": 459.2,
									"height": 191,
									"iscrop": false,
									"name": "Picture 4",
									"alternativeText": "Shape, rectangle\n\nDescription automatically generated",
									"visible": true,
									"widthScale": 80.86784,
									"heightScale": 80.87737,
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
				}
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
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 12,
				"fontFamily": "Arial",
				"fontSizeBidi": 12,
				"fontFamilyBidi": "Arial"
			},
			"next": "Normal"
		},
		{
			"name": "Heading 1",
			"type": "Paragraph",
			"paragraphFormat": {
				"textAlignment": "Left",
				"afterSpacing": 6,
				"lineSpacing": 1.149999976158142,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level1",
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 14,
				"fontColor": "#002060FF",
				"fontSizeBidi": 14
			},
			"basedOn": "Normal",
			"link": "Heading 1 Char",
			"next": "Normal"
		},
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
			"name": "Heading 1 Char",
			"type": "Character",
			"characterFormat": {
				"fontSize": 14,
				"fontColor": "#002060FF",
				"fontSizeBidi": 14
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
				"afterSpacing": 3,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"outlineLevel": "Level2",
				"listFormat": {},
				"keepWithNext": true
			},
			"characterFormat": {
				"bold": true,
				"fontColor": "#002060FF",
				"boldBidi": true
			},
			"basedOn": "Normal",
			"link": "Heading 2 Char",
			"next": "Normal"
		},
		{
			"name": "Heading 2 Char",
			"type": "Character",
			"characterFormat": {
				"bold": true,
				"fontColor": "#002060FF",
				"boldBidi": true
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Heading 3",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 35.70000076293945,
				"firstLineIndent": -17.850000381469728,
				"beforeSpacing": 3,
				"outlineLevel": "Level3",
				"listFormat": {
					"listId": 6
				},
				"tabs": [
					{
						"position": 0,
						"deletePosition": 0,
						"tabJustification": "List",
						"tabLeader": "None"
					}
				],
				"contextualSpacing": false,
				"widowControl": false
			},
			"characterFormat": {},
			"basedOn": "List Paragraph",
			"link": "Heading 3 Char",
			"next": "Normal"
		},
		{
			"name": "List Paragraph",
			"type": "Paragraph",
			"paragraphFormat": {
				"leftIndent": 36,
				"listFormat": {},
				"contextualSpacing": true
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"next": "List Paragraph"
		},
		{
			"name": "Heading 3 Char",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": 225.64999389648438,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 451.29998779296877,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"tabs": [
					{
						"position": 225.64999389648438,
						"deletePosition": 0,
						"tabJustification": "Center",
						"tabLeader": "None"
					},
					{
						"position": 451.29998779296877,
						"deletePosition": 0,
						"tabJustification": "Right",
						"tabLeader": "None"
					}
				]
			},
			"characterFormat": {},
			"basedOn": "Normal",
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Balloon Text",
			"type": "Paragraph",
			"paragraphFormat": {
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
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
				"fontSizeBidi": 8,
				"fontFamilyBidi": "Tahoma"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation reference",
			"type": "Character",
			"characterFormat": {
				"fontSize": 8,
				"fontSizeBidi": 8
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "annotation text",
			"type": "Paragraph",
			"paragraphFormat": {
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {},
				"widowControl": false
			},
			"characterFormat": {
				"fontSize": 10,
				"fontFamily": "Times New Roman",
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
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
				"fontSizeBidi": 10,
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Normal (Web)",
			"type": "Paragraph",
			"paragraphFormat": {
				"beforeSpacing": 5,
				"afterSpacing": 5,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {
				"fontFamily": "Times New Roman",
				"fontFamilyBidi": "Times New Roman"
			},
			"basedOn": "Normal",
			"next": "Normal (Web)"
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
	"lists": [
		{
			"abstractListId": 6,
			"levelOverrides": [],
			"listId": 6
		}
	],
	"abstractLists": [
		{
			"abstractListId": 6,
			"levels": [
				{
					"characterFormat": {
						"fontFamily": "Symbol",
						"fontFamilyBidi": "Symbol"
					},
					"paragraphFormat": {
						"leftIndent": 36,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Courier New",
						"fontFamilyBidi": "Courier New"
					},
					"paragraphFormat": {
						"leftIndent": 72,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "o",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Wingdings",
						"fontFamilyBidi": "Wingdings"
					},
					"paragraphFormat": {
						"leftIndent": 108,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Symbol",
						"fontFamilyBidi": "Symbol"
					},
					"paragraphFormat": {
						"leftIndent": 144,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Courier New",
						"fontFamilyBidi": "Courier New"
					},
					"paragraphFormat": {
						"leftIndent": 180,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "o",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Wingdings",
						"fontFamilyBidi": "Wingdings"
					},
					"paragraphFormat": {
						"leftIndent": 216,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Symbol",
						"fontFamilyBidi": "Symbol"
					},
					"paragraphFormat": {
						"leftIndent": 252,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Courier New",
						"fontFamilyBidi": "Courier New"
					},
					"paragraphFormat": {
						"leftIndent": 288,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "o",
					"restartLevel": 0,
					"startAt": 0
				},
				{
					"characterFormat": {
						"fontFamily": "Wingdings",
						"fontFamilyBidi": "Wingdings"
					},
					"paragraphFormat": {
						"leftIndent": 324,
						"firstLineIndent": -18,
						"listFormat": {}
					},
					"followCharacter": "Tab",
					"listLevelPattern": "Bullet",
					"numberFormat": "",
					"restartLevel": 0,
					"startAt": 0
				}
			]
		}
	],
	"comments": [],
	"revisions": [],
	"customXml": []
}
describe('header with floating element', () => {
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
    it('Check the header widget height', function () {
        console.log('Check the header widget height');
        container.openBlank();
        container.open(text);
        expect(container.documentHelper.pages[0].headerWidget.height).toBe(315);
    });
    it('Check the footer widget height', function () {
        console.log('Check the footer widget height');
        container.openBlank();
        container.open(text);
        expect(container.documentHelper.pages[0].footerWidget.height).toBe(254.66667000000007);
    });
});