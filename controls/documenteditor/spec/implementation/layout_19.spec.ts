import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { DocumentHelper, Editor, LineWidget, ParagraphWidget, Selection, TabElementBox, TableRowWidget, TableWidget, TableCellWidget, EditorHistory, TextElementBox, WordExport, SfdtExport, ElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { TargetLocator } from 'selenium-webdriver';
let data: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 608.5999755859375,
				"pageHeight": 841.6500244140625,
				"leftMargin": 63,
				"rightMargin": 10.800000190734864,
				"topMargin": 21.600000381469728,
				"bottomMargin": 21.600000381469728,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 0,
				"footerDistance": 0,
				"bidi": false
			},
			"blocks": [
				{
					"rows": [
						{
							"cells": [
								{
									"blocks": [
										{
											"paragraphFormat": {
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 36,
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
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 407.04998779296877,
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
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 36,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 2
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
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
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
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 36,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 0
								},
								{
									"blocks": [
										{
											"rows": [
												{
													"cells": [
														{
															"blocks": [
																{
																	"paragraphFormat": {
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "F"
																		},
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "dfgdfgdfgdfgdfgdfgdfg"
																		},
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "xcdffdfdfd"
																		},
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "         "
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 152.4499969482422,
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
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "dfgdfgdfgdfgdfgdfgdfgd"
																		},
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "fgdfgdfgdfgdfg"
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 170.8000030517578,
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
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "dfgdfgdfgfdg"
																		},
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "df"
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 72.5,
																"columnSpan": 1,
																"rowSpan": 1,
																"verticalAlignment": "Top"
															},
															"columnIndex": 2
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
																"lineWidth": 0
															},
															"left": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"right": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"bottom": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"diagonalDown": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"diagonalUp": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"horizontal": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"vertical": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
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
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "fgdfgdfgdf"
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 152.4499969482422,
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
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "dfgdfgdfgd"
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 170.8000030517578,
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
																		"styleName": "Normal",
																		"listFormat": {}
																	},
																	"characterFormat": {
																		"fontColor": "empty"
																	},
																	"inlines": [
																		{
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"text": "fgdfgdfgd"
																		}
																	]
																}
															],
															"cellFormat": {
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"shading": {},
																"preferredWidth": 122.4000015258789,
																"preferredWidthType": "Point",
																"cellWidth": 72.5,
																"columnSpan": 1,
																"rowSpan": 1,
																"verticalAlignment": "Top"
															},
															"columnIndex": 2
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
																"lineWidth": 0
															},
															"left": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"right": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"bottom": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"diagonalDown": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"diagonalUp": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"horizontal": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"vertical": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															}
														},
														"gridBefore": 0,
														"gridAfter": 0
													}
												}
											],
											"grid": [
												7.200000127156575,
												7.200000127156575,
												7.200000127156575
											],
											"tableFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "Single",
														"lineWidth": 0.5
													}
												},
												"shading": {},
												"leftIndent": 0,
												"tableAlignment": "Left",
												"topMargin": 0,
												"rightMargin": 5.4,
												"leftMargin": 5.4,
												"bottomMargin": 0,
												"preferredWidth": 21.600000381469728,
												"preferredWidthType": "Point",
												"bidi": false,
												"allowAutoFit": true
											},
											"description": null,
											"title": null,
											"columnCount": 3
										},
										{
											"paragraphFormat": {
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 407.04998779296877,
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
												"styleName": "Normal",
												"listFormat": {}
											},
											"characterFormat": {
												"fontColor": "empty"
											},
											"inlines": []
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 36,
										"preferredWidthType": "Point",
										"cellWidth": 36,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 2
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
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0
							}
						}
					],
					"grid": [
						36,
						57.6,
						36
					],
					"tableFormat": {
						"borders": {
							"top": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"left": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"right": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"bottom": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"vertical": {
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 0,
						"rightMargin": 5.4,
						"leftMargin": 5.4,
						"bottomMargin": 0,
						"preferredWidthType": "Auto",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 3
				},
				{
					"paragraphFormat": {
						"leftIndent": 58.5,
						"firstLineIndent": -62.099998474121097,
						"styleName": "Normal",
						"listFormat": {}
					},
					"characterFormat": {
						"fontColor": "empty"
					},
					"inlines": []
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"rows": [
								{
									"cells": [
										{
											"blocks": [
												{
													"paragraphFormat": {
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 21.600000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 18.950000762939454,
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
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 552.2000122070313,
												"preferredWidthType": "Point",
												"cellWidth": 498,
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
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 20.350000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 17.850000381469728,
												"columnSpan": 1,
												"rowSpan": 1,
												"verticalAlignment": "Top"
											},
											"columnIndex": 2
										}
									],
									"rowFormat": {
										"height": 1,
										"allowBreakAcrossPages": true,
										"heightType": "AtLeast",
										"isHeader": false,
										"borders": {
											"top": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"gridBefore": 0,
										"gridAfter": 0,
										"leftMargin": 0,
										"rightMargin": 0
									}
								},
								{
									"cells": [
										{
											"blocks": [
												{
													"paragraphFormat": {
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 21.600000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 18.950000762939454,
												"columnSpan": 1,
												"rowSpan": 1,
												"verticalAlignment": "Top"
											},
											"columnIndex": 0
										},
										{
											"blocks": [
												{
													"rows": [
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.30000001192092898,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 360,
																		"preferredWidthType": "Point",
																		"cellWidth": 321.79998779296877,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 172.3000030517578,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 3
																},
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 1.0499999523162842,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.949999988079071,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 4
																}
															],
															"rowFormat": {
																"height": 3.5999999046325685,
																"allowBreakAcrossPages": true,
																"heightType": "AtLeast",
																"isHeader": false,
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"rows": [
																				{
																					"cells": [
																						{
																							"blocks": [
																								{
																									"rows": [
																										{
																											"cells": [
																												{
																													"blocks": [
																														{
																															"paragraphFormat": {
																																"afterSpacing": 0,
																																"lineSpacing": 1,
																																"lineSpacingType": "Multiple",
																																"styleName": "Normal",
																																"listFormat": {}
																															},
																															"characterFormat": {
																																"fontColor": "empty"
																															},
																															"inlines": [
																																{
																																	"characterFormat": {
																																		"bold": true,
																																		"fontSize": 12,
																																		"fontFamily": "Calibri",
																																		"fontColor": "#696969FF",
																																		"boldBidi": true,
																																		"fontSizeBidi": 12,
																																		"fontFamilyBidi": "Calibri"
																																	},
																																	"text": "Testing24"
																																}
																															]
																														}
																													],
																													"cellFormat": {
																														"borders": {
																															"top": {
																																"hasNoneStyle": false,
																																"lineStyle": "Cleared",
																																"lineWidth": 0
																															},
																															"left": {
																																"hasNoneStyle": false,
																																"lineStyle": "Cleared",
																																"lineWidth": 0
																															},
																															"right": {
																																"hasNoneStyle": false,
																																"lineStyle": "Cleared",
																																"lineWidth": 0
																															},
																															"bottom": {
																																"hasNoneStyle": false,
																																"lineStyle": "Cleared",
																																"lineWidth": 0
																															},
																															"diagonalDown": {
																																"hasNoneStyle": false,
																																"lineStyle": "None",
																																"lineWidth": 0
																															},
																															"diagonalUp": {
																																"hasNoneStyle": false,
																																"lineStyle": "None",
																																"lineWidth": 0
																															},
																															"horizontal": {
																																"hasNoneStyle": false,
																																"lineStyle": "None",
																																"lineWidth": 0
																															},
																															"vertical": {
																																"hasNoneStyle": false,
																																"lineStyle": "None",
																																"lineWidth": 0
																															}
																														},
																														"shading": {},
																														"topMargin": 1.9500000476837159,
																														"rightMargin": 1.9500000476837159,
																														"leftMargin": 1.9500000476837159,
																														"bottomMargin": 1.9500000476837159,
																														"preferredWidth": 360,
																														"preferredWidthType": "Point",
																														"cellWidth": 322.1000061035156,
																														"columnSpan": 1,
																														"rowSpan": 1,
																														"verticalAlignment": "Top"
																													},
																													"columnIndex": 0
																												}
																											],
																											"rowFormat": {
																												"height": 14.100000381469727,
																												"allowBreakAcrossPages": true,
																												"heightType": "AtLeast",
																												"isHeader": false,
																												"borders": {
																													"top": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"left": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"right": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"bottom": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"diagonalDown": {
																														"hasNoneStyle": false,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"diagonalUp": {
																														"hasNoneStyle": false,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"horizontal": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													},
																													"vertical": {
																														"hasNoneStyle": true,
																														"lineStyle": "None",
																														"lineWidth": 0
																													}
																												},
																												"gridBefore": 0,
																												"gridAfter": 0,
																												"leftMargin": 0,
																												"rightMargin": 0
																											}
																										}
																									],
																									"grid": [],
																									"tableFormat": {
																										"borders": {
																											"top": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"left": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"right": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"bottom": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"diagonalDown": {
																												"hasNoneStyle": false,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"diagonalUp": {
																												"hasNoneStyle": false,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"horizontal": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											},
																											"vertical": {
																												"hasNoneStyle": true,
																												"lineStyle": "None",
																												"lineWidth": 0
																											}
																										},
																										"shading": {},
																										"leftIndent": 0,
																										"tableAlignment": "Left",
																										"topMargin": 0,
																										"rightMargin": 0,
																										"leftMargin": 0,
																										"bottomMargin": 0,
																										"preferredWidthType": "Auto",
																										"bidi": false,
																										"allowAutoFit": true
																									},
																									"description": null,
																									"title": null,
																									"columnCount": 0
																								},
																								{
																									"paragraphFormat": {
																										"afterSpacing": 0,
																										"lineSpacing": 1,
																										"lineSpacingType": "Multiple",
																										"styleName": "Normal",
																										"listFormat": {}
																									},
																									"characterFormat": {
																										"fontColor": "empty"
																									},
																									"inlines": []
																								}
																							],
																							"cellFormat": {
																								"borders": {
																									"top": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"left": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"right": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"bottom": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalDown": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalUp": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"horizontal": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"vertical": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									}
																								},
																								"shading": {},
																								"preferredWidth": 360,
																								"preferredWidthType": "Point",
																								"cellWidth": 322.1000061035156,
																								"columnSpan": 1,
																								"rowSpan": 1,
																								"verticalAlignment": "Top"
																							},
																							"columnIndex": 0
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
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"left": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"right": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"bottom": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"diagonalDown": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalUp": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"horizontal": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"vertical": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							}
																						},
																						"gridBefore": 0,
																						"gridAfter": 0,
																						"leftMargin": 0,
																						"rightMargin": 0
																					}
																				},
																				{
																					"cells": [
																						{
																							"blocks": [
																								{
																									"paragraphFormat": {
																										"afterSpacing": 0,
																										"lineSpacing": 1,
																										"lineSpacingType": "Multiple",
																										"styleName": "EmptyCellLayoutStyle",
																										"listFormat": {}
																									},
																									"characterFormat": {
																										"fontColor": "empty"
																									},
																									"inlines": []
																								}
																							],
																							"cellFormat": {
																								"borders": {
																									"top": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"left": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"right": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"bottom": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalDown": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalUp": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"horizontal": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"vertical": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									}
																								},
																								"shading": {},
																								"preferredWidth": 360,
																								"preferredWidthType": "Point",
																								"cellWidth": 322.1000061035156,
																								"columnSpan": 1,
																								"rowSpan": 1,
																								"verticalAlignment": "Top"
																							},
																							"columnIndex": 0
																						}
																					],
																					"rowFormat": {
																						"height": 1.600000023841858,
																						"allowBreakAcrossPages": true,
																						"heightType": "AtLeast",
																						"isHeader": false,
																						"borders": {
																							"top": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"left": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"right": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"bottom": {
																								"hasNoneStyle": false,
																								"lineStyle": "Cleared",
																								"lineWidth": 0
																							},
																							"diagonalDown": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalUp": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"horizontal": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"vertical": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							}
																						},
																						"gridBefore": 0,
																						"gridAfter": 0,
																						"leftMargin": 0,
																						"rightMargin": 0
																					}
																				}
																			],
																			"grid": [],
																			"tableFormat": {
																				"borders": {
																					"top": {
																						"hasNoneStyle": false,
																						"lineStyle": "Cleared",
																						"lineWidth": 0
																					},
																					"left": {
																						"hasNoneStyle": false,
																						"lineStyle": "Cleared",
																						"lineWidth": 0
																					},
																					"right": {
																						"hasNoneStyle": false,
																						"lineStyle": "Cleared",
																						"lineWidth": 0
																					},
																					"bottom": {
																						"hasNoneStyle": false,
																						"lineStyle": "Cleared",
																						"lineWidth": 0
																					},
																					"diagonalDown": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalUp": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"horizontal": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"vertical": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					}
																				},
																				"shading": {},
																				"leftIndent": 0,
																				"tableAlignment": "Left",
																				"topMargin": 0,
																				"rightMargin": 0,
																				"leftMargin": 0,
																				"bottomMargin": 0,
																				"preferredWidthType": "Auto",
																				"bidi": false,
																				"allowAutoFit": true
																			},
																			"description": null,
																			"title": null,
																			"columnCount": 0
																		},
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "Normal",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 322.1000061035156,
																		"columnSpan": 2,
																		"rowSpan": 2,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 0
																},
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 1
																},
																{
																	"blocks": [
																		{
																			"rows": [
																				{
																					"cells": [
																						{
																							"blocks": [
																								{
																									"paragraphFormat": {
																										"textAlignment": "Right",
																										"afterSpacing": 0,
																										"lineSpacing": 1,
																										"lineSpacingType": "Multiple",
																										"styleName": "Normal",
																										"listFormat": {}
																									},
																									"characterFormat": {
																										"fontColor": "empty"
																									},
																									"inlines": [
																										{
																											"characterFormat": {
																												"bold": true,
																												"italic": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#000000FF",
																												"boldBidi": true,
																												"italicBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "**Contains "
																										},
																										{
																											"characterFormat": {
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#000000FF",
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "Alignment issue"
																										},
																										{
																											"characterFormat": {
																												"bold": true,
																												"italic": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#000000FF",
																												"boldBidi": true,
																												"italicBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": " "
																										},
																										{
																											"characterFormat": {
																												"bold": true,
																												"italic": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#000000FF",
																												"boldBidi": true,
																												"italicBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "**"
																										}
																									]
																								}
																							],
																							"cellFormat": {
																								"borders": {
																									"top": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"left": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"right": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"bottom": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"diagonalDown": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalUp": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"horizontal": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"vertical": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									}
																								},
																								"shading": {},
																								"topMargin": 1.9500000476837159,
																								"rightMargin": 1.9500000476837159,
																								"leftMargin": 1.9500000476837159,
																								"bottomMargin": 1.9500000476837159,
																								"preferredWidth": 187.9499969482422,
																								"preferredWidthType": "Point",
																								"cellWidth": 172.3000030517578,
																								"columnSpan": 1,
																								"rowSpan": 1,
																								"verticalAlignment": "Top"
																							},
																							"columnIndex": 0
																						}
																					],
																					"rowFormat": {
																						"height": 14.100000381469727,
																						"allowBreakAcrossPages": true,
																						"heightType": "AtLeast",
																						"isHeader": false,
																						"borders": {
																							"top": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"left": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"right": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"bottom": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalDown": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalUp": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"horizontal": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"vertical": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							}
																						},
																						"gridBefore": 0,
																						"gridAfter": 0,
																						"leftMargin": 0,
																						"rightMargin": 0
																					}
																				}
																			],
																			"grid": [],
																			"tableFormat": {
																				"borders": {
																					"top": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"left": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"right": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"bottom": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalDown": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalUp": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"horizontal": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"vertical": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					}
																				},
																				"shading": {},
																				"leftIndent": 0,
																				"tableAlignment": "Left",
																				"topMargin": 0,
																				"rightMargin": 0,
																				"leftMargin": 0,
																				"bottomMargin": 0,
																				"preferredWidthType": "Auto",
																				"bidi": false,
																				"allowAutoFit": true
																			},
																			"description": null,
																			"title": null,
																			"columnCount": 0
																		},
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "Normal",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 172.3000030517578,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 1.0499999523162842,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.949999988079071,
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
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 172.3000030517578,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 1.0499999523162842,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.949999988079071,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 2
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
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.30000001192092898,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 360,
																		"preferredWidthType": "Point",
																		"cellWidth": 321.79998779296877,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 2
																},
																{
																	"blocks": [
																		{
																			"rows": [
																				{
																					"cells": [
																						{
																							"blocks": [
																								{
																									"paragraphFormat": {
																										"textAlignment": "Right",
																										"afterSpacing": 0,
																										"lineSpacing": 1,
																										"lineSpacingType": "Multiple",
																										"styleName": "Normal",
																										"listFormat": {}
																									},
																									"characterFormat": {
																										"fontColor": "empty"
																									},
																									"inlines": [
																										{
																											"characterFormat": {
																												"bold": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#696969FF",
																												"boldBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "06/24/2021 - 06/24/2021"
																										}
																									]
																								}
																							],
																							"cellFormat": {
																								"borders": {
																									"top": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"left": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"right": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"bottom": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"diagonalDown": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalUp": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"horizontal": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"vertical": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									}
																								},
																								"shading": {},
																								"topMargin": 1.9500000476837159,
																								"rightMargin": 1.9500000476837159,
																								"leftMargin": 1.9500000476837159,
																								"bottomMargin": 1.9500000476837159,
																								"preferredWidth": 189,
																								"preferredWidthType": "Point",
																								"cellWidth": 173.25,
																								"columnSpan": 1,
																								"rowSpan": 1,
																								"verticalAlignment": "Top"
																							},
																							"columnIndex": 0
																						}
																					],
																					"rowFormat": {
																						"height": 14.100000381469727,
																						"allowBreakAcrossPages": true,
																						"heightType": "AtLeast",
																						"isHeader": false,
																						"borders": {
																							"top": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"left": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"right": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"bottom": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalDown": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalUp": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"horizontal": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"vertical": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							}
																						},
																						"gridBefore": 0,
																						"gridAfter": 0,
																						"leftMargin": 0,
																						"rightMargin": 0
																					}
																				}
																			],
																			"grid": [],
																			"tableFormat": {
																				"borders": {
																					"top": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"left": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"right": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"bottom": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalDown": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalUp": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"horizontal": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"vertical": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					}
																				},
																				"shading": {},
																				"leftIndent": 0,
																				"tableAlignment": "Left",
																				"topMargin": 0,
																				"rightMargin": 0,
																				"leftMargin": 0,
																				"bottomMargin": 0,
																				"preferredWidthType": "Auto",
																				"bidi": false,
																				"allowAutoFit": true
																			},
																			"description": null,
																			"title": null,
																			"columnCount": 0
																		},
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "Normal",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 173.25,
																		"columnSpan": 2,
																		"rowSpan": 2,
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
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.30000001192092898,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 0
																},
																{
																	"blocks": [
																		{
																			"rows": [
																				{
																					"cells": [
																						{
																							"blocks": [
																								{
																									"paragraphFormat": {
																										"afterSpacing": 0,
																										"lineSpacing": 1,
																										"lineSpacingType": "Multiple",
																										"styleName": "Normal",
																										"listFormat": {}
																									},
																									"characterFormat": {
																										"fontColor": "empty"
																									},
																									"inlines": [
																										{
																											"characterFormat": {
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#000000FF",
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "Alignment issue"
																										},
																										{
																											"characterFormat": {
																												"bold": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#696969FF",
																												"boldBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": " "
																										},
																										{
																											"characterFormat": {
																												"bold": true,
																												"fontSize": 12,
																												"fontFamily": "Calibri",
																												"fontColor": "#696969FF",
																												"boldBidi": true,
																												"fontSizeBidi": 12,
																												"fontFamilyBidi": "Calibri"
																											},
																											"text": "Date(s):"
																										}
																									]
																								}
																							],
																							"cellFormat": {
																								"borders": {
																									"top": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"left": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"right": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"bottom": {
																										"hasNoneStyle": false,
																										"lineStyle": "Cleared",
																										"lineWidth": 0
																									},
																									"diagonalDown": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"diagonalUp": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"horizontal": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									},
																									"vertical": {
																										"hasNoneStyle": false,
																										"lineStyle": "None",
																										"lineWidth": 0
																									}
																								},
																								"shading": {},
																								"topMargin": 1.9500000476837159,
																								"rightMargin": 1.9500000476837159,
																								"leftMargin": 1.9500000476837159,
																								"bottomMargin": 1.9500000476837159,
																								"preferredWidth": 360,
																								"preferredWidthType": "Point",
																								"cellWidth": 321.79998779296877,
																								"columnSpan": 1,
																								"rowSpan": 1,
																								"verticalAlignment": "Top"
																							},
																							"columnIndex": 0
																						}
																					],
																					"rowFormat": {
																						"height": 14.100000381469727,
																						"allowBreakAcrossPages": true,
																						"heightType": "AtLeast",
																						"isHeader": false,
																						"borders": {
																							"top": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"left": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"right": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"bottom": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalDown": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"diagonalUp": {
																								"hasNoneStyle": false,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"horizontal": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							},
																							"vertical": {
																								"hasNoneStyle": true,
																								"lineStyle": "None",
																								"lineWidth": 0
																							}
																						},
																						"gridBefore": 0,
																						"gridAfter": 0,
																						"leftMargin": 0,
																						"rightMargin": 0
																					}
																				}
																			],
																			"grid": [],
																			"tableFormat": {
																				"borders": {
																					"top": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"left": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"right": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"bottom": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalDown": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"diagonalUp": {
																						"hasNoneStyle": false,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"horizontal": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					},
																					"vertical": {
																						"hasNoneStyle": true,
																						"lineStyle": "None",
																						"lineWidth": 0
																					}
																				},
																				"shading": {},
																				"leftIndent": 0,
																				"tableAlignment": "Left",
																				"topMargin": 0,
																				"rightMargin": 0,
																				"leftMargin": 0,
																				"bottomMargin": 0,
																				"preferredWidthType": "Auto",
																				"bidi": false,
																				"allowAutoFit": true
																			},
																			"description": null,
																			"title": null,
																			"columnCount": 0
																		},
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "Normal",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 360,
																		"preferredWidthType": "Point",
																		"cellWidth": 321.79998779296877,
																		"columnSpan": 1,
																		"rowSpan": 2,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 1
																},
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 2
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
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.30000001192092898,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 172.3000030517578,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 1.0499999523162842,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.949999988079071,
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
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														},
														{
															"cells": [
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 0.15000000596046449,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.30000001192092898,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 360,
																		"preferredWidthType": "Point",
																		"cellWidth": 321.79998779296877,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 3,
																		"preferredWidthType": "Point",
																		"cellWidth": 2.6500000953674318,
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
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 187.9499969482422,
																		"preferredWidthType": "Point",
																		"cellWidth": 172.3000030517578,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 3
																},
																{
																	"blocks": [
																		{
																			"paragraphFormat": {
																				"afterSpacing": 0,
																				"lineSpacing": 1,
																				"lineSpacingType": "Multiple",
																				"styleName": "EmptyCellLayoutStyle",
																				"listFormat": {}
																			},
																			"characterFormat": {
																				"fontColor": "empty"
																			},
																			"inlines": []
																		}
																	],
																	"cellFormat": {
																		"borders": {
																			"top": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"left": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"right": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"bottom": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalDown": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"diagonalUp": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"horizontal": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			},
																			"vertical": {
																				"hasNoneStyle": false,
																				"lineStyle": "None",
																				"lineWidth": 0
																			}
																		},
																		"shading": {},
																		"preferredWidth": 1.0499999523162842,
																		"preferredWidthType": "Point",
																		"cellWidth": 0.949999988079071,
																		"columnSpan": 1,
																		"rowSpan": 1,
																		"verticalAlignment": "Top"
																	},
																	"columnIndex": 4
																}
															],
															"rowFormat": {
																"height": 2.8499999046325685,
																"allowBreakAcrossPages": true,
																"heightType": "AtLeast",
																"isHeader": false,
																"borders": {
																	"top": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"left": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"right": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"bottom": {
																		"hasNoneStyle": false,
																		"lineStyle": "Cleared",
																		"lineWidth": 0
																	},
																	"diagonalDown": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"diagonalUp": {
																		"hasNoneStyle": false,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"horizontal": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	},
																	"vertical": {
																		"hasNoneStyle": true,
																		"lineStyle": "None",
																		"lineWidth": 0
																	}
																},
																"gridBefore": 0,
																"gridAfter": 0,
																"leftMargin": 0,
																"rightMargin": 0
															}
														}
													],
													"grid": [],
													"tableFormat": {
														"borders": {
															"top": {
																"hasNoneStyle": false,
																"lineStyle": "Cleared",
																"lineWidth": 0
															},
															"left": {
																"hasNoneStyle": false,
																"lineStyle": "Cleared",
																"lineWidth": 0
															},
															"right": {
																"hasNoneStyle": false,
																"lineStyle": "Cleared",
																"lineWidth": 0
															},
															"bottom": {
																"hasNoneStyle": false,
																"lineStyle": "Cleared",
																"lineWidth": 0
															},
															"diagonalDown": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"diagonalUp": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"horizontal": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															},
															"vertical": {
																"hasNoneStyle": false,
																"lineStyle": "None",
																"lineWidth": 0
															}
														},
														"shading": {},
														"leftIndent": 0,
														"tableAlignment": "Left",
														"topMargin": 0,
														"rightMargin": 0,
														"leftMargin": 0,
														"bottomMargin": 0,
														"preferredWidthType": "Auto",
														"bidi": false,
														"allowAutoFit": true
													},
													"description": null,
													"title": null,
													"columnCount": 0
												},
												{
													"paragraphFormat": {
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "Normal",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 552.2000122070313,
												"preferredWidthType": "Point",
												"cellWidth": 498,
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
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 20.350000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 17.850000381469728,
												"columnSpan": 1,
												"rowSpan": 1,
												"verticalAlignment": "Top"
											},
											"columnIndex": 2
										}
									],
									"rowFormat": {
										"height": 1,
										"allowBreakAcrossPages": true,
										"heightType": "AtLeast",
										"isHeader": false,
										"borders": {
											"top": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"gridBefore": 0,
										"gridAfter": 0,
										"leftMargin": 0,
										"rightMargin": 0
									}
								},
								{
									"cells": [
										{
											"blocks": [
												{
													"paragraphFormat": {
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 21.600000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 18.950000762939454,
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
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 552.2000122070313,
												"preferredWidthType": "Point",
												"cellWidth": 498,
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
														"afterSpacing": 0,
														"lineSpacing": 1,
														"lineSpacingType": "Multiple",
														"styleName": "EmptyCellLayoutStyle",
														"listFormat": {}
													},
													"characterFormat": {
														"fontColor": "empty"
													},
													"inlines": []
												}
											],
											"cellFormat": {
												"borders": {
													"top": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"left": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"right": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"bottom": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalDown": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"diagonalUp": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"horizontal": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													},
													"vertical": {
														"hasNoneStyle": false,
														"lineStyle": "None",
														"lineWidth": 0
													}
												},
												"shading": {},
												"preferredWidth": 20.350000381469728,
												"preferredWidthType": "Point",
												"cellWidth": 17.850000381469728,
												"columnSpan": 1,
												"rowSpan": 1,
												"verticalAlignment": "Top"
											},
											"columnIndex": 2
										}
									],
									"rowFormat": {
										"height": 1,
										"allowBreakAcrossPages": true,
										"heightType": "AtLeast",
										"isHeader": false,
										"borders": {
											"top": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": true,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"gridBefore": 0,
										"gridAfter": 0,
										"leftMargin": 0,
										"rightMargin": 0
									}
								}
							],
							"grid": [],
							"tableFormat": {
								"borders": {
									"top": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": true,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"shading": {},
								"leftIndent": 0,
								"tableAlignment": "Left",
								"topMargin": 0,
								"rightMargin": 0,
								"leftMargin": 0,
								"bottomMargin": 0,
								"preferredWidthType": "Auto",
								"bidi": false,
								"allowAutoFit": true
							},
							"description": null,
							"title": null,
							"columnCount": 0
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
				"evenHeader": {
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
				"evenFooter": {
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
				"firstPageHeader": {
					"blocks": [
						{
							"paragraphFormat": {
								"afterSpacing": 0,
								"lineSpacing": 0,
								"lineSpacingType": "Multiple",
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontSize": 0,
								"fontColor": "empty",
								"fontSizeBidi": 0
							},
							"inlines": []
						}
					]
				},
				"firstPageFooter": {
					"blocks": [
						{
							"paragraphFormat": {
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
		"fontColor": "empty",
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
		"afterSpacing": 8,
		"lineSpacing": 1.0791666507720948,
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
	"dontUseHTMLParagraphAutoSpacing": true,
	"formFieldShading": true,
	"compatibilityMode": 3,
	"styles": [
		{
			"name": "Normal",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontColor": "empty"
			},
			"next": "Normal"
		},
		{
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			}
		},
		{
			"name": "EmptyCellLayoutStyle",
			"type": "Paragraph",
			"paragraphFormat": {
				"listFormat": {}
			},
			"characterFormat": {
				"fontSize": 1,
				"fontColor": "empty",
				"fontSizeBidi": 1
			},
			"next": "EmptyCellLayoutStyle"
		},
		{
			"name": "Header",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
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
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Header Char",
			"next": "Header"
		},
		{
			"name": "Header Char",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Default Paragraph Font"
		},
		{
			"name": "Footer",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
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
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Normal",
			"link": "Footer Char",
			"next": "Footer"
		},
		{
			"name": "Footer Char",
			"type": "Character",
			"characterFormat": {
				"fontColor": "empty"
			},
			"basedOn": "Default Paragraph Font"
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
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontColor": "empty"
				},
				"inlines": [
					{
						"characterFormat": {
							"fontColor": "empty"
						},
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"paragraphFormat": {
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontColor": "empty"
				},
				"inlines": [
					{
						"characterFormat": {
							"fontColor": "empty"
						},
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
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
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontColor": "empty"
				},
				"inlines": [
					{
						"characterFormat": {
							"fontColor": "empty"
						},
						"text": "\u0003"
					}
				]
			}
		],
		"continuationSeparator": [
			{
				"paragraphFormat": {
					"afterSpacing": 0,
					"lineSpacing": 1,
					"lineSpacingType": "Multiple",
					"styleName": "Normal",
					"listFormat": {}
				},
				"characterFormat": {
					"fontColor": "empty"
				},
				"inlines": [
					{
						"characterFormat": {
							"fontColor": "empty"
						},
						"text": "\u0004"
					}
				]
			}
		],
		"continuationNotice": [
			{
				"paragraphFormat": {
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('nested table validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Nested table width validation', () => {
        editor.open(JSON.stringify(data));
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let cell: TableCellWidget = ((table.childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget);
        let width1: number = cell.cellFormat.preferredWidth;
        let nesttable: TableWidget = (((table.childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).childWidgets[0] as TableWidget);
        let width2: number = nesttable.tableFormat.preferredWidth;
        expect(width1 > width2).toBe(true);
    });
});
let imgdata: any = {
	"sections": [
		{
			"sectionFormat": {
				"pageWidth": 608.5999755859375,
				"pageHeight": 841.6500244140625,
				"leftMargin": 3.5999999046325685,
				"rightMargin": 10.800000190734864,
				"topMargin": 21.600000381469728,
				"bottomMargin": 21.600000381469728,
				"differentFirstPage": true,
				"differentOddAndEvenPages": false,
				"headerDistance": 0,
				"footerDistance": 0,
				"bidi": false
			},
			"blocks": [
				{
					"paragraphFormat": {
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"text": "Thanveer"
						}
					]
				},
				{
					"paragraphFormat": {
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": [
						{
							"characterFormat": {},
							"imageString": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABccAAALnCAMAAAB7vw+pAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOUExURQAAAAAAAAAAAAAAAABAiv9AC//VIAAAAABIh6+vr/9AEP/PIAAAAAAAAAAAAAAAALOzswAAALGxsQAAAAAAAHGLos6Id868fQAAALKysgAAAAAAAAAAAAAAAAAAAAAAAAAAALOzswAAAAAAAABFhv9CDv/TIAAAAO9CFf/KIAAAAAAAAABFh7Ozs/9DD//TIAAAAJahrL+gmL+3mwAAAAAAAAAAAABFhrS0tP9CDv/UIPxDEP/SIPtCEP/RHwAAAAdJiP1HFP3TJvhGFf3QJAAAAAAAABJPirOzs/hNHvjRLvVMHvnPLAAAAABFhhZSi52mrrOzs72ln723ofNPIvVQIvXPMvfOMP9CDv/TIBnbyJAAAABNdFJOUwAIEBgYGBggICAgICgwOEBASEhQWFhYWGBgaHB4gIePl5efp6enp6+ysre/v7+/v8fHx8fP19/f39/f4uLj4+fn5+fq6u/39/f39/j4dSb43gAAAAlwSFlzAAAywAAAMsABKGRa2wAAQwxJREFUeF7t3Qt7Os95mGEOqelBElYlN6qklVTJjVJhx0qN1DRNi5MY3CRe26mTuP3+X6Tzzr57gkWzDAzsap77auMF8ePPsMvDMiwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiM34aTa71GU1vn2bLT9mya2eBgB01+0yTdNnPWGdv5pzMvMLPQ8A0E1n77bX1Y7f2XNyN3ouAKCDhskqq3W143J6NXtKXj5laTnWswEAnXPxIcl+Mf+n3vHF3cgu3UvlX+0iAKB7xjbT4+lax1+SoS4NEvOnpS4DALrmPE0/LweD9Y5XDOU9UCZWAKCjRgu75/1FxwfyLuhUlwEA3fRVx2XunI4DQLe59scnugwA6CbH/PiqeNcTANBJX3T80vzpRZcBAB31RcefzZ+udBkA0FHbO36+StMF0yoA0HHbOy7vcu74/Sr//i/+EUDM/uI/ag1wRFs7fmv+MNPlL+jKAwDxvzUNOKJtHb+QWZUWH+bUdQcAlqYBR7Sl45NFmq52/gwQ6xCIGw04ieaOj+Rba3f/PSDWIRA3GnASjR0fzc25D3piB6xDIG404CSaOm4z3jRp7sI6BOJGA06ioeNDOeLQ6wckWIdA3GjASWx2fPhmznrz+gAQ6xCIGw04iY2O75Fx1iEQORpwEusdtxmfeX4cn3UIxI0GnMR6x1/N6Xn2Q8u7Yx0CcaMBR3abCPlSw7ldOpczr8zJdD6r2OXDQKxDIG404LiGUuwqu1f+oCdKT/bS7bAOgbjRgOMaaacLtuP3eqL0aC/dDusQiBsNOLIbO5tSsvMqo3s9VdjlBzpZh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAf3HOgTiRgP6j3UIxI0G9B/rEIgbDeg/1iEQNxrQf6xDIG40oP9Yh0DcaED/sQ6BuNGA/mMdAnGjAadxndxNdLEwuU9en5ObkZ5sjXUIxI0GnMLZe5qmz3pCXczMedbLjiVnHQJxowHHN7xfSa7rHb+z52UW53pmO6xDIG404OguPrJa1zp+LecsXpMX+8fPnfbIWYdA3GjAkQ0fbLHN/692/Fz2xu/t4vXSLL7axZZYh0DcaMBxDT9NpZc307WOv1ZOX5nldKwn2mAdAnGjAcd1YRr9NBqsdfzMnPwY6gkb9QddboN1CMSNBhzXOH2/MP+z1vF7c/JOl7Md8rkut8E6BOJGA45MKr7RcTnksDxGZSgz5Du808k6BOJGA05ireOrNF3qopibv2a9b4V1CMSNBpxEveMjc6p6hMqLOX2tyy2wDoG40YCTqHd8Ujs1GMihidlBiK2wDoG40YCTqHdcTj3pskjM6USXW2AdAnGjASdR77h8mLPa7Ttz+lGXW2AdAnGjASdR7/jtWsdvan91Yh0CcaMBJ1HvuMyjVOfD3R3/aZVZh7oEIEZ0/CTc++Nfz4+b1QYABU0Djujr+XHp+K0uN/thlVmHugQgRnT8JOodl1PV41Xkfc4rXW6BdQjEjQacRL3j8jVZ1c8BPZrTU11ugXUIxI0GnES94/I5oHddFvKFhxu/3rkd6xCIGw04iXrHB+ZU9YuxPtN0VXyLrRvrEIgbDTiJtY7LF2OVX6gi0ywzXW6DdQjEjQacxFrHZUK8PLnjx/JZh0DkaMBJrHX80pxc5DPi42WarvhdNwBt0YCTWOu4nViZZzPkI/lRiR2+XYV1CMSOBhzZ2VTIEeJvdimLt3Q9nd+eDcZXH2ZpscvuOOsQiBwNOLKVFLtC97xlTryw2uHgcYN1CMSNBhzXWFNdyGdX7svAf+zwm26CdQjEjQYc2cusrjjccPK0sBWf3+7wE8sW6xCIGw3okun0TJd2wToE4kYD+o91CMSNBvQf6xCIGw3oP9Zh5/3Jz/bzA70eoBEN6D/WYef95f/bz7/T6wEa0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+Yx12Hh1HUDSg/1iHnUfHERQN6D/WYefRcQRFA/qPddh5dBxB0YD+c6/DH/9kP3+k1wNPdBxB0fH+c6/D//ab/fxrvR54ouMIio73Hx3vPDqOoOh4/9HxzqPjCIqO9x8d7zw63nf/+c/286/0egKh4/1HxzuPjvfdf/+/+/m3ej2B0PH+o+OdR8f7jo4jMDreeXS87+g4AqPjnUfH+46OIzA63nl0vO/oOAKj451Hx/uOjiMwOt55dLzv6DgCo+OdR8f7jo4jMDreeXS87+g4AqPjnUfH+46OIzA6Hty+n8r+K+2xLzp+anQcgdHx4PZ9FP8v7bEvOn5qdByB0fHg6Hjs6DgCo+PB0fHY0XEERseDo+Oxo+MIjI4HR8djR8cRGB0Pjo7Hjo4jMDoeHB2PHR1HYHQ8ODoeOzqOwOh4cHQ8dnQcgdHx4Oh47Og4AqPjwdHx2NFxBEbHg6PjsaPjCIyOB0fHY0fHERgdD46Ox46OIzA6Hhwdjx0dR2B0PDg6Hjs6jsDoeHB0PHZ0HIHR8eDoeOzoOAKj48HR8djRcQRGx4Oj47Gj4wiMjgdHx2NHx9Ha+XR6oYs7oOPB0fHY0XG0Mnr4TK1lMtKzWqLjwdHx2NFxtHG7zCouFtd6Zjt0PDg6Hjs6jhZubMBns5ndKV+d6dmt0PHg6Hjs6DjcJitT72w+ZTo3i3N7bkt0PDg6Hjs6DrdHybguj2WGZZcdcjoeHB2PHR2H28yku3h3U6J+pctt0PHg6Hjs6DjczC74py5mc+X3utwGHQ+OjseOjsNtkaZLXRwM7tgf7xo6Hjs6Drc3k+6pLtsTE11ug44HR8djR8fhJrvgH8Ns+cosP2eL7dDx4Oh47Og43IYLE++53QmfLtN0ObbntkTHg6PjsaPjaOFCDjZc3A0G9yuT8XM9tx06Hhwdjx0dRxvn9nP5Hx/yf3bLOB0Pj47Hjo6jlfGzhDxNV/c6T94aHQ+OjseOjqOdiXwg33hv8dW1P60y61CXtvmV9tjXn+v1ROvv9NHo69faY18/19uBU9l3C/ivej2B0PGOGD3IV6xkX1377NwjN6ttF7/VHvv6nV5PtP5ZH42+/qA99vV7vR04lX23gP+j1xOOpgGnNJGJ8c+rwaXdKZ+7jlf5YZVZh7q0zS+0x75+pNcTrb/WR6OvX2qPff2x3g6cyr5bwH/Q6wmEjnfCmRx3+GR3w2/tfvkuc+Tudcj8+J6YH48d8+Nwk73wO10+t03XE23Q8eDoeOzoOJzkm7FedXkwmJpTu3wwn44HR8djR8fh9GrCXTloXE7u8NNudDw4Oh47Og6nRZqudFEkpuP5r0q0QMeDo+Oxo+NwMt2udvzenL7V5RboeHB0PHZ0HE7yNufavMoOn82n48HR8djRcTjJL7mV73NerOq75y50PDg6Hjs6DqdL0/H0VQ9RuZIPde4wPU7Hw6PjsaPjcJMZ8TSdPSbJi3yws7Jz3gIdD46Ox46Oo4UnG/Lca/Hb+W3Q8eDoeOzoONqYPMvn8a1Xvn+8a+h47Og4WppOk+R+2uJba9fQ8eDoeOzoOAKj48HR8djRcQRGx4Oj47Gj4wiMjgdHx2NHxxEYHQ+OjseOjiMwOh4cHY8dHUdgdDw4Oh47Oo7A6HhwdDx2dByB0fHg6Hjs6DgCo+PB0fHY0XEERseDo+Oxo+MIjI4HR8djR8cRGB0Pjo7Hjo4jMDoeHB2PHR1HYHQ8ODoeOzq+r8fZ7F4X0YSOB0fHY0fH9/WZpjNdRBM6Hhwdjx0db3ZudrPT+ezxyvkTZsfu+MXbbLbjL/KcFh0Pjo7Hjo43uV7ob5il6TJxlPy4HR/ZX8q80VO9QMeDo+Oxo+ObRu+24LnF13u/R+34ZfYEQ8dr6Lg+Gn3R8b6Lp+P6mN+kfy9MTJmNz5fkYfYhS2/6h2ZH7Pj4zd4yOr6Gjuuj0Rcd7zs6vt7xoc34s86mTF9dmT5ex2+W5oYtZnR8HR3XR6MvOt53dHy948+S8cqRhJeLjuyPX5nbtXoYJnR8HR3XR6MvOt53dHyt4+eS8Vs9YQ3HutDsaB2/SdO3yWBAxzfQcX00+qLjfUfH1zouu+Nf7IBfTKdDXVTtOz6aTitPCdOpLqyZTrccIDN9u5T/oeMb6Lg+Gn3R8b6j4/WOj1cmk9sOULnNDmT5nN1VWl52/CNNH7Il42KRLrXUs3RlCjy1b1J+Zv/07Fn+O/Py4nqhixd7oZcvjnWk4xvouD4afdHxvqPj9Y7LJPRcl9eMK4cjLsqd6bLj5vxyz/zGnNLcmkvcDB7svzPeTMjvpeL2RBFse6Hi/M/txzrS8Q10XB+Nvuh439HxescfTSUre8kVV3K0iClsllrZec6067h99zTzmL2VmnnNLrJxodXWSXk6voGO66PRFx3vOzpe77jsc9fe5czZCZd3mbs+uzbNTRf51Eqrji/M/7sbDS5kbmVl/s8yGQ/ObbbPssvohZbJZDC5k/Obn0wMOr6Bjuuj0Rcd7zs6Xu+4fF6y2NWukonrV223/aTQXbbcruNpOp/I4nAuy+kymzaR63y0S3qhz6zq12axeJ5YR8c30HF9NPqi431Hx+sdl5rmu8hVcjjihy6bXXIJrc58tOv4p06Ey/x7utT/glxpPhlvL5RPpkjtt82Q0/ENdFwfjb7oeN/R8VrHRyaSadOesOw653vgRuVDla06vrR748bQnL0q3iSVmRRdlAsVTyC35lKNrwoMOr6Bjuuj0Rcd7zs6Xuv4RDKryzUfJrOVvsvMh85gt+p4eb458amL2dOB7qjXLiRXv63VdHwDHddHoy863nd0fHN/PN93rlrVD0eUiZWXbHHHjpt0lx2Xdzr1v1a70NScn+jyOjq+gY7ro9EXHe87Or45P97wQcuxObv6KU/p/Xu2SMcd6HhwdDx2dLzecTm6sKGSEtZnXbbMac0xHXeg48HR8djR8XrHZca6oaBNHdd5FjruQMeDo+Oxo+P1jsvnORs+l78+ryLvhzI/3g4dD46Ox46O1zt+aSqZXumJilU1s7XQlgFeVg8xp+M5Oh4cHY8dHa93fCgf6Gz43tqP+leeyLdeXWeLZYDl2MRsyaDjOToeHB2PHR2vd3xwbzK59hkc+WSlfA6o/JEgqX2e9TLAMreet35kzqbjFh0Pjo7Hjo6vddwGuP67btJd+Qj9QpObxb7yxSga4CdzrtZ3ZL9HhY4LOh4cHY8dHV/ruG1omr5eZKeu37W7r+bM/FvB5c3Qhu87lLn17Lcjzuzv7NNxi44HR8djR8fXO26/3ES8P71lvxxhP/Bjf7dz+XY/vX60+9q39rJGJcDyh9XTzbXsmMs31B6248PnmTAXTD9k4aUyX99ldDw4Oh47Or7R8cFN9lMRufestJfyDmhuWR7SUgnwdfkPX+ULsQ7b8eyFQkVl8qfL6HhwdDx28XR8B2OZOFEfxRzGyP52pjWr7ApXA3yhrV+ZxJr/OWzHL+Saq+i4ouP6aPRFx/uOjjcaXttJjJe72neRTx9n8/R99qhz55mbJCl3zse3T++L2b20+TZJNNG1S1wlSTm7PU2S/Mtwaxca3ifJxvePy5k1X/wYc5fQ8eDoeOzoOAKj48HR8djRcQRGx4Oj47Gj4wiMjgdHx2NHxxEYHQ+OjseOjiMwOh4cHY8dHUdgdDw4Oh47Oo7A6HhwdDx2dByB0fHg6Hjs6DgCo+PB0fHY0XEERseDo+Oxo+MIjI4HR8djR8cRGB0Pjo7Hjo4jMDoeHB2PHR1HYHQ8ODoeOzqOwOh4cHQ8dnQcgdHx4Oh47Og4AqPjwdHx2NFxBEbHg6PjsaPjCIyOB0fHY0fHERgdD46Ox46Oo63R3esyTdPlLP8B6XboeHB0PHZ0HC3dLkzEM6tdfqqfjgdHx2NHx9HKeK4Nt3bZIafjwdHx2NFxtDF8N/VePk3Hg9H0brYa69lt0PHg6Hjs6DjaeDIZ/zzXE7uh48HR8djRcbRwJRnf6d3NEh0Pjo7Hjo6jhVfT8TNd3hUdD46Ox27fLeC//Gw/P9DbsQUd74Qzk/E3Xd4ZHQ+Ojseu41sAHe+EB9PxK13eGR0Pjo7Hjo7DbZamC13cHR0Pjo7Hjo7DbZmmM13cHR0Pjo7Hjo7DaZKm6bP53/H05nY6zM5rj44HR8djR8fhNDUdTyaPn+Z/jOXDbimn48HR8djRcTjdmHpXP5b/caF/aIWOB0fHY0fH4SQdt/2ezWYrWeBz+d1Cx2NHx+GUSLs/77N430rJH+3iVj+tMutQl7b5lfbY15/r9UTr7/TR6OvX+mj09XO9HTiVjm8BdLwLpOMvxaS4fEbfsUNuVtsufqs99vU7vZ5o/bM+Gn39QR+Nvn6vtwOn0v0tQNOA07k15U502ZCp8q8/FfTDKrMOdWmbX2iPff1Irydaf62PRl+/1Eejrz/W24FT6fgWQMe7QObHKx2X3fM7XW7BvQ6ZH98T8+OxY34cTtLxJ102ZPfcMUFeRceDo+Oxo+NwOjfhrnxNlmSdjncJHY8dHYfT0IR7rsvGvTl5q8st0PHg6Hjs6DjcPky5y59WfjandvgkEB0Pjo7Hjo7DTcpdvLM5lgPId/ggEB0Pjo7Hjo7D7cKUe5HvkMtPde4wPU7Hw6PjsaPjaEEmVuZZyB/N4pLP5XcKHY8dHUcLlzKX8vl8d/tkvy9rh3c56fgR0PHY0XG0IceM55bXemY7dDw4Oh47Oo5Wroovrn3fZVLFoOPB0fHY0XG0dJ28zGazh3M92RodD46Ox46OIzA6Hhwdjx0d39dTunrQRTSh48HR8djR8X197vNb8jGg48HR8djR8UbD6xc5ZPrz9W6i52x1xI6bWyXH/72/7HTc36nR8eDoeOzoeIPh/dIemWE9Ow7POFrHh/cLvUkm5Tv90vFp0fHg6Hjs6PimieyKl5aXen6zY3V8WP3F+jSd6tndR8eDo+Oxi6fjeoM36d8L53ZnfDV7uEoe32Wx8tXbDY7VcfmOk3T+cHeT2KeZz+L3MruOjgdHx2NHx9c7PrKzF/d6avK4cmT6iB1/PssW5QvA094cJEPHg6PjsaPj6x1/MY1cVT55fj5/0aVmR5tXeS4/gSO38Sj/0UOg48HR8djR8bWOT2Vfd5fJ56O9z1lxZm7jUpc7j44HR8djR8fXOv5qErl9B/xsenu9dqhI+46fX99Mi1/VObu61lmSurPL2xbHosjhh84jIjuCjgdHx2NHx+sdtz920xjYwWD0YJot5o+VNxnLji/T9DlbMmS//ipbnNulG/uPl4+25BdvcmL1XF5PdqHL7KCUmavRMoevi51Hx4Oj47Gj4/WOy2/Bv+vympvKQeUf5Vx12XFzfrlnLld0ky2aS9wMZUrbmo8GwwddTt+L/XN7Ifn9NGvpmNmRi+hi59Hx4Oh47Oh4vePyazeJLtclNrCrWbbHXL4T2qrjt7L/vTILxsvQ7oxnB6m/ZhcpL5Tq9X/56SM5BrH8T3UcHQ+OjseOjtc7LhXV/NadS11f7YzLVC60yKdEWnXc7Mp/XA0GI7vD/W7+tflTtlee79hnF5LzB9ey4//lL2DKs01vPptPx4Oj47Gj4/WOy8Rz45yGvP+Zt3UkIc9PtOp4mr5lMyh2lzv9zOa/5ReL8/dU7YXm2V647G6vihmXTUNzK7/eYe8SOh4cHY8dHa93XGra9CajvG051+Xs3dA8pO06/q6771dmOc/4YGKWP7JFeyH9JePBYGZOfPF7DbIjX76j2nV0PDg6Hjs6Xuv42BSy8UAQ2Y+ufDhI9s51YqNVxxfF3rM8AxTHw3yUb1fWLiS/hrn9W13OzXUsvthd7xg6Hhwdjx0dr3Vc9pAbOy7FrRxseG0uph+Mb9Xx8nxz4lMXs/1uDXLtQrLXrv9401C+9EUPaewDOh4cHY8dHa91fGgS2TivYnaBy2mV7AOVOrO9Y8dNusuOy9ue+l+rXUhmcZqPmjHkTc6vvyqgW+h4cHQ8dnR8c3684X1O2U8vDhE0Rua0dv3YHZc5l4/+zKrQ8SOg47Gj4/WOyyF/DTMal+bsJ122zGnN8ZE7Lte7bHrF0Fl0PDg6Hjs6Xu+4vJ/ZUFA5ErB6hIjMv+jHPo/bcXlCWX5xKEsH0fHg6Hjs6Hi94/KpzepEuJLjWKo/J3Gq+fFLOdzl698n6hw6Hhwdjx0dr3dc9nebDgZZ1r92RUKrPzVRBthcpkx0kI73MeN0PDw6Hjs6Xu+4HGDYtEMun+CszErLMSNa+zLAlaPBs7cjD91xOXD8i+PKO4qOB0fHY0fH1zp+Z1JZ/cTPYDCScsrXFZZfeTKST+Lo4eRlgE2ii9ZP5AP+B+64/eFQvc4eoePB0fHY0fG1jg9lh7z6u253S+numSl3+f6i7I7f6XIZYPm6FG39xJx76I73NON0PDw6Hjs6vtbxbPIifbuyfR3fm77a7kq69VvB7XeJN3zfoXwlYvYMMLW/1XzYjlf38HuFjgdHx2NHx9c7bt9MFMuZTJQY9kAV+0NB6fzpJnmzkW74/nE7iZ6+JYl8+4ok+qAdl8vWLLf8bFHX0PHg6Hjs6PhGxweX2d50bpZ9fdWZrbT6KH9DsxLgC5n5yDzJUYgH7bg+qVT0ZOecjgdHx2MXT8d3MEzKIL8Wn9IfFr/Glj5XPhdfDfBEW7+8st/I4t1x+djReseLH4Yr9OS7suh4cHQ8dnS82UXyMJs9Jde1LzKZ3L7OzLm3mt7MZZKUO+ejafI6e76RufOr5E6/h7Z2iYskKY8cPEuSfH6mdqHhTXJffImtGk3X6R+6jo4HR8djR8cRGB0Pjo7Hjo4jMDoeHB2PHR1HYHQ8ODoeOzqOwOh4cHQ8dnQcgdHx4Oh47Og4AqPjwdHx2NFxBEbHg6PjsaPjCIyOB0fHY0fHERgdD46Ox46OIzA6Hhwdjx0dR2B0PDg6Hjs6jsDoeHB0PHZ0HIHR8eDoeOzoOAKj48HR8djRcQRGx4Oj47Gj4wiMjgdHx2NHxxEYHQ+OjseOjiMwOh4cHY8dHUdgdDw4Oh47Oo7A6HhwdDx2dByB0fHg6Hjs6DgCo+PB0fHY0XEERseDo+Oxo+MIrPsd/5Of7ekHekWnQsdjR8cRWPc7/pe6MXo7dcfoeOzoOAKj48HR8djRcQRGx4Oj47Gj4wiMjgdHx2NHxxEYHQ+OjseOjiMwOh4cHY8dHUdgdDw4Oh47Oo7A6HhwdDx2dByB0fHg6Hjs6Dh2cJYkyd2ZnmiJjgdHx2NHx9HeeJUaKz3VEh0Pjo7Hjo6jvRfJeJrqqZboeHB0vOd+/JM9/Q9dk77oeEQuZGecjm+i49jLvo+A3/xPXZO+6HhE5mn6+knHN9Fx7IWO42juzN74hI43oOPYCx3HsYwXafowoOMN6Dj2QsdxLI9puhjS8SZ0HHuh4ziScxPw6wEdb0LHsRc6jiN5T9N38z90vAEdx17oOI7j2vT73PwvHW9Ax7EXOo6jGC7S9EkW6HgDOo690HEcxWOaLseyQMcb0HHshY7jGM5WaXpnl+h4AzqOvdBxHMNrms6HdomON6Dj2AsdxxFcmXhfZoutOv7TKrMOdWmbX+nG6OvP9Xp8/b1ujN5+rld0Kn+nj0Zfv9Zx+Dr1+Htv30fAb/5B16SvwFsAHe+CoYn3qy636rhZbbv4rW6Mvn6n1+PrX3Rj9PZ7vaJT+Wd9NPr6g47D16nH33v7PgJ+80+6Jn2F3wI0DTide/liFV1u1fEfVpl1qEvb/EI3Rl8/0uvx9Te6MXr7Y72iU/lrfTT6+qWOw9epx997+z4CfvO3uiZ9Bd4CetDx9zR90cVvSn494kGXmR9vwvw49sL8eEDTkS58yYRtpovHcDbd8WfV9vdgdscvp2phOm7+xx6D2A4dD46O9xwdD+Psbm56labzx6mes9UROz55+LC36uNph4zub2b/o3UL/VsLdDw4Ot5zdDyE8ZPWSswu9NwtjtbxUeVWLW/1zGNo6nja6rWKRceDo+M9R8cDOF9qq9S1nt/sWB2Xg0Yqvr5RB1V9VsvtMGQ6Hhwd7zk63pr+Bzfp3wuX9kfh58+308vkSZa/btaxOi4/jjm/Ph8Mprar2afkj0+eTXSxJToeHB3vOTremv4HN+nfc2PZG1/d6KlRsuxMx+f5XL18LCe91xNHRscb0HHshY63pv/BTfr3nMwGLyvvbo5fn3Wp2bE6PqzMpLya23iigx3peAM6jr3Q8db0P7hJ/67svq7jrc2aY3W86tbcxrkuHxkdb0DHsRc63pr+Bzfp39Wb6VT+GfRN0/skucw/2pgpOz6eVg9SPJvKzy6I8dQ+LwyvkuS6+LcXSVI7Pl0vJOdf1f8DDS7NjZQf5zkBOt6AjmMvdLw1/Q9u0r9nzkymtu2On73Yd0CNl8qbjGXHzV/LZwBJrc6EfNile/kEjbmEjfSN5NC0uCx5diE9f+F4QXBvLsO8SoGO66PRFx0/MTremv4HN+nfMzcmU1tmLCSeuYV++59RdtycX86wyBXpm6XmEjejd/vvjM/JYCQ7/ZY5oeyFivNXXx9WKJc75hHkFY+zmf1doPboeHB0vOfoeGv6H9ykf888m0ImulyXHUU9f37L9quLw0Vaddx+PHQ+s/vzryM58TGzR6kXzxn5hT5nZsnIJ2WayHUvsq8D7wE6Hhwd39Of/Gw/P9Dr8UXHW9P/4Cb9e0ZSmh9zWHMucX20i2PZHV7lUyutOm68S5kTWTJPBJ+yPy8XKXqdXehDzj+XZ4rsP9XoRp4OTrQ77oGOB0fH97TvFrDvHUDHW9P/4Cb9e0Z2khu/UkUCn/2y2WAwlJDnoW3Z8Zds/1mOGCzmxaXq+TS3vdBrdr48Z6waPvh+Np1OrxO5Jc3PNd1Ex4Oj43ui4zoQX13ruDSy6XARORyxjPTI7BGvdE+6XcffskX7qcx0ro0em+WPbDG7UD5XIrVveKsz/76A5dPRv/NwD3Q8ODq+JzquA/HVsY5LWVe6XCN74Fe6bLyYkzqz0arjn8VstnkGWBZPFB/lf00uVOyCyz+u/Ndy5lxr9XrbsLfeVXQ8ODq+JzquA/HVsY5PJJNN7yCazFa/qlWOKtSfVmjV8fJ8k+5PXcyeHXSevXYh2ftvmAB/mc3spIpROWCm6+h4cHR8T3RcB+KrYx0fSiObJi3M2dUP3shh5nqs+I4dn1U7LkfH6M557UJTc37zUTPmJk4TO7+ST9Z3Hh0Pjo7viY7rQHx1rON26qJhV7fSbWtkTushg8fuuDGSf7fqyxw5HQ+Oju+JjutAfHWt47Kr2zCjIWGtfV2WOa05PkHHswmZvvwqKB0Pjo7viY7rQHx1reNypEjxm8IlOcyk2nGZf9F5lpN0XF4f7PDTaidFx4Oj43ui4zoQX13ruBzS3fBRSZlHKTObdVQ/nn6SjtvXDSf6JYld0fHg6Pie6LgOxFfXOm6P7254C9F0s/o+pxyvop/MLwNsLlMmOnDH5eta9F92HR0Pjo7viY7rQHx1reP2c5sNX5QlZ1e+8kQCrAd4lwGuHA2efUV4wI7LR/PZH1d0XB+Nvui4DsQXHdeBbHH8jst+dP2dzjM59WjOLb/yZGwyms++lAE2iS5ab3+rOVzH5QL5J0G7jo4HR8f3RMd1IL4613Fb48qPX44ebHel3Kv8gMRh5eOclQDLNyLqpHn2k/sH7fiTXpsYmUuf6gc6d0bHg6Pje6LjOhBf3ev4RKYs0o/7qdnfHk7lB/Ntd2WHXENuv0u8+oWzGmD7lYi2rrf2Og7bcfPv7vSyV5Lx96aPnXYRHQ+Oju+JjutAfHWv47ovbXxkNc4+ADS25y7ekif70fjyl5grAZajutOP56cP8z9y4MtBO25vzHz2kGSfzV/pv+s+Oh4cHd8THdeB+Opgxwfn+ZeYZJ6y76Sy3zqeey8rWgnwuewnZ+7lKMSDdlxeEJQ+Gr9ct5PoeHB0fE90XAfi63gd38VNUfLFU1lsnS0x+8LVxlYDPLKT66ayF3b/uVXHm74nS45+XO/44EJm5TOL3ny5ikHHg6Pje6LjOhBf3ey42fu+SYzbyqGGxvAqeZw9JPVvlD2bTitTHGfXDy+J/erw86nMsIvaJSbTafnFKONp8aP69au5mNZ+TD83TZLXp+TS8SvMHUPHg6Pje6LjOhBfXe04DoaOB0fH90THdSC+6Pi3R8eDo+N7ouM6EF90/Nuj48HR8T3RcR2ILzr+7dHx4Oj4nui4DsQXHf/26HhwdHxPdFwH4ouOf3vhO/6nf7afv9KN0Rsd7zk6rgPxRce/vfAdP/VGTMf1dvQWHdeB+KLj3x4dD46O74mO60B80fFvj44HR8f3RMd1IL7o+LdHx4Prfcd//JP9/JFejy86rgPxRce/PToeXO87vu8WcOojlui4DmQLOt5/dDw4Oq7X44uO60B80fFvj44HR8f1enzRcR2ILzr+7dHx4Oi4Xo8vOq4D8UXHvz06Hhwd1+vxRcd1IL7o+LdHx4Oj43o9vui4DsQXHf/26HhwdFyvxxcd14H4ouPfHh0Pjo7r9fii4zoQX3T826PjwdFxvR5fdFwH4ouOf3t0PDg6rtfji47rQHzR8W+PjgdHx/V6fNFxHYgvOv7t0fHg6Lhejy86rgPxRce/PToeHB3X6/FFx3Ugvuj4t0fHg6Pjej2+6LgOxBcd//boeHB0XK/HFx3Xgfii498eHQ+Ojuv1+KLjOhBfdPzbo+PB0XG9Hl90XAfii45/e3Q8ODqu1+OLjutAfNHxb4+OB0fH9Xp80XEdiC86/u3R8eDouF6PLzquA/FFx789Oh4cHdfr8UXHdSC+6Pi3R8eDo+N6Pb7ouA7EFx3/9uh4cHRcr8cXHdeB+KLj3x4dD46O6/X4ouM6EF90/Nuj48HRcb0eX3RcB+KLjn97dDw4Oq7X44uO60B80fFvj44HR8f1enzRcR2ILzr+7dHx4Oi4Xo8vOq4D8UXHvz06Hhwd1+vxRcd1IL7o+LdHx4Oj43o9vui4DsQXHf/26HhwdFyvxxcd14H4ouPfHh0Pjo7r9fii4zoQX3T826PjwdFxvR5fdFwH4ouOf3t03OnHP9nP/9CB+KLjOhBfdFwHsgUd7z867tT3O4CO6/X4ouPoOjruRMd1IL7ouK5JX3Q8GueXSTI90xM7oONOdFwH4ouO65r0RcfjMHlapJmHoZ7VFh13ouM6EF90XNekLzoeg9GzRlwspnpuS3TciY7rQHzRcV2Tvuh4DF404ZnlWM9uh4470XEdiC86rmvSFx2PwczE+0F2wy/eJOQv2bkt0XEnOq4D8UXHdU36ouMxeFsl+ay4nWGZ6IlW6LgTHdeB+KLjuiZ90fEYTEa6MBgM5f3OKz3RCh13ouM6EF90XNekLzoemyfT8XtdboWOO9FxHYgvOq5r0hcdj82t6Xiiy63QcSc6rgPxRcd1Tfqi47G5Nx2/0+VW6LgTHdeB+KLjuiZ90fHYyLzKtS63Qsed6LgOxBcd1zXpi47HZpGmq50OIKfjTnRcB+KLjuua9EXHIzM1u+NvutwOHXei4zoQX3Rc16QvOh4Z+SDQjS63Q8ed6LgOxBcd1zXpi47H5dpkfL7bN2XRcSc6rgPxRcd1Tfqi41EZyaeALvXEdj+tMutQl7b5lW6Mvv5BN0Zfv9aN0dvPdSC++n4H7Dv+ve+AP9fr8fX3OhBfp94Aur4F0PFueTUZf9TlL5jVtovf6sbo6590Y/T1B90Yvf1eB+Kr73fAvuPf+w74nV6Pr3/Rgfg69QbQgy1A04AOeDQZf28xq/LDKrMOdWmbX+jG6OtvdWP09UvdGL39sQ7EV9/vgH3Hv/cd8CO9Hl9/owPxdeoNoOtbAB3vEvko52Kn78gS7nXI/LgOxBfz43o9vpgf14H4Yn68Py5Xabq60BPt0XEnOq4D8UXHdU36ouPROF+ajLvf49xAx53ouA7EFx3XNemLjsfCN+N03I2O60B80XFdk77oeCQk4zt+AEjRcSc6rgPxRcd1Tfqi43Hwzzgdd6PjOhBfdFzXpC86HgWb8Z1+PaJEx53ouA7EFx3XNemLjsfgTDK+049HVNBxJzquA/FFx3VN+qLjERh+moy/TSt2+eJaOu5Ex3Ugvui4rklfdDwCVybjdTP9Sxt03ImO60B80XFdk77oeAQutd6lT/1LG3TciY7rQHzRcV2Tvuh4BMbyLYc1z/qXNui4Ex3Xgfii47omfdFxONBxJzquA/FFx3VN+qLjcKDjTnRcB+KLjuua9EXH4UDHnei4DsQXHdc16YuOw4GOO9FxHYgvOq5r0hcdhwMdd6LjOhBfdFzXpC86Dgc67kTHdSC+6LiuSV90HA503ImO60B80XFdk77oOBzouBMd14H4ouO6Jn3RcTjQcSc6rgPxRcd1Tfqi43Cg4050XAfii47rmvRFx+FAx53ouA7E15/+2X7+Sgfii47rQLag4/1Hx53ouA7EV9/vADqOrqPjTnRcB+KLjutAfNFxONBxJzquA/FFx3Ugvug4HOi4Ex3Xgfii4zoQX3QcDnTciY7rQHzRcR2ILzoOBzruRMd1IL7ouA7EFx2HAx13ouM6EF90XAfii47DgY470XEdiC86rgPxRcfhQMed6LgOxBcd14H4ouNwoONOdFwH4ouO60B80XE40HEnOq4D8UXHdSC+6Dgc6LgTHdeB+KLjOhBfdBwOdNyJjutAfNFxHYgvOg4HOu5Ex3Ugvui4DsQXHYcDHXei4zoQX3RcB+KLjsOBjjvRcR2ILzquA/FFx+FAx53ouA7EFx3Xgfii43Cg4050XAfii47rQHzRcTjQcSc6rgPxRcd1IL7oOBzouBMd14H4ouM6EF90HA503ImO60B80XEdiC86Dgc67kTHdSC+6LgOxBcdhwMdd6LjOhBfdFwH4ouOw4GOO9FxHYgvOq4D8UXH4UDHnei4DsQXHdeB+KLjcKDjTnRcB+KLjutAfNFxONBxJzquA/FFx3Ugvug4HOi4Ex3Xgfii4zoQX3QcDnTciY7rQHzRcR2ILzoOBzruRMd1IL7ouA7EFx2HAx13ouM6EF90XAfii47DgY470XEdiC86rgPxRcfhQMed6LgOxBcd14H4ouNwoONOdFwH4ouO60B80XE40HEnOq4D8UXHdSC+6Dgc6LgTHdeB+KLjOhBfdBwOdNyJjutAfNFxHYgvOg4HOu5Ex3Ugvui4DsQXHYcDHXei4zoQX3RcB+KLjsOBjjvRcR2ILzquA/FFx+FAx53ouA7EFx3Xgfii43Cg4050XAfii47rQHzRcTjQcSc6rgPxRcd1IL7oOBzouBMd14H4ouM6EF90HA503ImO60B80XEdiC86Dgc67kTHdSC+6LgOxBcdhwMdd6LjOhBfdFwH4ouOw4GOO9FxHYgvOq4D8UXH4UDHnei4DsQXHdeB+KLjcKDjTnRcB+KLjutAfNFxONBxJzquA/FFx3Ugvug4HOi4Ex3Xgfii4zoQX3QcDnTciY7rQHzRcR2ILzoOBzruRMd1IL7ouA7EFx2HAx13ouM6EF90XAfii47HZDod69IO6LgTHdeB+KLjOhBfdDwW06dlKl6u9Iy26LgTHdeB+KLjOhBfdDwOw2cbcet1pGe2Q8ed6LgOxBcd14H4ouNRGL5rw633oZ7dCh13ouM6EF90XAfii45H4cXUe3k/GQzO7H75s57dCh13ouM6EF90XAfii47H4FLiPc2Wb2X5PFtuhY470XEdiC86rgPxRcdj8GrSneiy3Td/0eU26LgTHdeB+KLjOhBfdDwCE1PuD10eDKbm1FKX26DjTnRcB+KLjutAfNHxCMhUyqMuGwtzcoeJFTruRMd1IL7ouA7EFx2PgEyrVI4al4mVG11ugY470XEdiC86rgPxRccjMDfhrhwzfm9OFrPlbnTciY7rQHzRcR2ILzoegc80/dRFcWU6vsORh3TciY7rQHzRcR2ILzoeAdPtasfljc43XW6BjjvRcR2ILzquA/FFx7+/ken2uy4L6fhMl1ug4050XAfii47rQHzR8e9PDjusdnv9tAMdd6LjOhBfdFwH4ouOf3/r+9+7d9zht7ox+von3Rh9/UE3Rm+/14H46vsdsO/4o78D9h1/D+4ArQFO5nznjuuqAwBL04CTaZpX+fqD+brqAED8J00DTmbY0PEnXW4j+ufiv/jHf6NLcYp9/NwB7I53war69SrZfPkOnwNiJdJxOq5LkaLjXfBZ/2KsG9PxW11ug47TcV2KFB2n4x0gn8uf6LLxYE5e63IbdJyO61Kk6Dgd7wD5nqzKF2PJb7xVsu5Ex+m4LkWKjtPxDrgz4S4PUJG3OavT5U50nI7rUqToOB3vgDNT7tVYTwwezakHXW6FjtNxXYoUHafjXfBm0p1/w+H5qhr1Nug4HdelSNFxOt4F8k21eqjh5XLX3XFWIh2n47oUKTreDU8S8nT28CLvcaazoZ7dDh2n47oUKTpOxzthKIes5GaV3wZqg47TcV2KFB2n4x1xJ7+uLBb3ek5rdJyO61Kk6Dgd74xp8jB7SHb5AJCi43RclyJFx+k4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4lslUTfSMgxvdJtdDXe6gMx3/dKxnHNZlYlye66kuOtfxT0d6xkGNru0dcKEnu+hCxz8Nt5UO5erDbGCA2YbTwvIlSG6vF+a6b/RE99xkgxeL5ys981Amzyu97o+pntU5id5C4/Pp0Ldy+qZXnb53tuTPeguNj4cwT7jDT7n2lZ4CDu3Jbr+5j4NvxuPsgdzdjhehsd4Pus/0oNdqPeuZXfOhty/zesid8uGrXqv1oOd2Tf5Um3kMsS+jz5V6Cji0ys6IWF3r+Qdys8yut7sdn2U3MLc80/MPQHf13+fZ/97q2R1jdxVLnwd8JruXK1zMHmfZc0VHX5LY21Z6P3zIJ/pUoSeBQ5OO28fXcGrnABaH3B87e5ett9vzKtJx+9bA6PJFbu27Pfcg7szTwqPNon06W3VzflQ6bhcmV/Y57cWeOAizcT1n0yn2DljYxc4xt+zTLpzd2Gfcw79uMC9LPuRRoCeBQys6blxKyB/1xAFM5frmF/KisgcdN+wO9OFekVytHvNnxTO5K+71RLcUHTfs6//DTWQn8+K6buWaD/ha54DMDcs6bsjDYXXod/wvzZVeVu9m4MCqHbcn5rp8AKYKy7ssDv3ouD1xuP3RYWUHXKbKD7ine0C1wMiJMPPYsj966LeRD8PcsKLjQ7mZB54AG5q9/Nf63QwcVq3j1+bEAd9Uv0+fpWQ96rhM6B5wYqVCjgs64FPkAdUCI297h3m6kfeTu/mCxNywouP2+fbAT2R3dhefjiOgWsdH5kRa2Yk8u3ubreavyWV+3uhx9lJcenD99lZOQkyeZk9rE8CjrI896vi5OVE+ps3p+9ksfX9JikOrzSify9mB+9nrpS6ayz7PvjjWYWKuuQcdvzInZrosLh5m7+ns+b44tPripbKahw+zl/IIp+nrLNHFBtLxA7+JfiC1dS7zP9Ujiy6fZh+r2dNdsdVfmlEWq3lkNodyFubqbdawKz9e2mcGOo6Aah0fmxNLXTan7Pt+1lIfgWdmuajRcGV2NIpN+tH8qXlmtUcdn5oT5f74WXlM4qcOTTpXPMzr1Zdj7La/SSyXrQayO2qBkXcIyv3xqX2f2prrs5fZuUyLWsu98arLg8G8uvFskDc6DzfzfkjmhpVrUTbWcn/8qjwoc6bPXrKdF1uz3BvlG0pmiA0v5swjbGEeJXQcAdU6Lm/IFFviRLa8wnOWKNmu8+pJ9NJif9Rcetm8O9qjjsvjssjYuaSn8GAHJ89dxWEXcunivTv5yxehluQ96XK31AIjlSoyVvmIlHnGziZF5HVFsYnIpYtncvnL9mPkZWORnHWQuWX1Z+Nip1q23MIy24ZlIMUmIpcu/q38ZfMFiTyBy/sCdBwBVTs+lN2vu/yEbHjL59vp5YPdK8v2u6pNtp9yyfdGvngU96fjo+qbcfJ6OF083UyvHu3haFmFZRc93620n3LJ7y95FH8x/yv3czenFaqBsQc65zMl8qyefj5eT6+f7G5pdvNlMZ9YsfdLvvVI9beOcCz3bH5XdYy5ZUWL5W2M4vhQe4zNx8PV9OZZ7qRsvQ/NZpHvsMhyufXIdr75isPcR/bpnY4joErH7TxKsc8kb/l96M6m3S+xD2/ZzvNX0vZRnD8CZN90y6O4Nx2fyHIxbSRv+eUf75R7KXvpIbXSnS7ZAy/3wWXftNiv3yCP+HIOqlMqgTmXVZqvXpve1+w2D+XpK9s0KmtTnrvLZ3LzrLZ1hLdyXV39QKu5aflWPJU7Ix+QPXZFX0ON5J7JNo3KI8a+Ii2ensxFyv36nGwv9pFDxxGQbJV38iU+yaPd/8x3xsYmUp/FdK9UOnt8m21bH632TdFiXsE80Lc9irvf8Wsz/qvExvojb7G8Hi4/2idPcfYOkLcQdF4hexSv9E4y+6kf2VKT9bfPOkQCIxvAdWJfX7znK11WW970wVDuJhsseSbXeYVs3kXbJc9Ub9lixShJkueZbFmrA34w4bDMjVvIHXCTyCDzp661ye+RvA6xL9XkoC6derL7N/kzuWwZGzNn8lyQXQcdR0A2XoVZsUcpu5fl62C7a2KLXe6NmO1Zts3sQrJvuvkoznS/46Xy60UkauXxzvIgzd7FlEmmbC/djEvuluxCsm+6/Xg1maNZ5i/XO0ZWYqk85EbOrxyMYk5lbwyYMeu8gtkW5ELZNiMXuLVLVXZqQuj7K12ktzCzKma4ZU+m8hFcedKyT+Ajc74+Y5ttwdwBuv8iFyiPXlLmYaSfkJZ7yi4Ah1ft+Gc+1WmY3Y/q/rVk3U6byPt12Q6G+ZePJoLZ3ojMpW5rdX86Pi+7Jd+eVH2VLFm3k58y35SNxvzLe9PnbDdbgrX9cAz515uR64Zqx9/KmSF55qq+b1vMi8t8U7ahmH8pw86eyeXdks1nKtl5zaxe83eEu0ZvoGU/8JCRTbryEsrOjNklmWOy95O8IpU7IHsmNy/ZNt7ol4/x6nqn4whIOj6f6fFlz+V2aDbA6qO4eBdPdryzvpkNc2oSndVeHtzb9je73/H3mZ3rr75RKRmrToTI3pZ9IpNDL+10gzyKJybQ2b1hHtzbvz5EHuwNR6R1gwRmpt9kpcdkCFnj1aMvZA3bJyrpm30mP5eVb+64bDsxV9AwxOF9kiQvM/tcsSpf33WK3LRZdhPTRblHLSututlKvu0mXjx3mX2aTznY0G4n0vmNT1CZf5O/30LHEVA+T3J2bwJdTo2sH34i9cpOy66l7FmZS6yG+UFVspVWs1/T/Y7L3tW5fWVSlGs9Y7JjmZ02Q7X7XfZRnL+NJU9v1fur5sL88ZDfo3hYeWAuJFTlilrPWLEWZah2XuFO1rk8k8vEgWww1ftrTfYVXFsPZzkpc8Psc/Gl7M2sitek8hK08gK1eKTYodoHinlqe5az7RO4bDDrW7m8eM1fpNFxBFRsnYNzCXn+SFvPmOx8ZqGWcsneiH0Uy2SpvLcjmd960F0/Op496oqHnQyzeqPlDslCLRMIco+Zx/mz3W2XgctO6sbkqDqTV+Tb/nh6ZWBkyqj4kqj1jMkdkm0R8p6vXMo8oyf2bU95Jpfsf/lUJfvzi20v2U7K3DCdQbO3MZ/Ilx2W/M4Q5WZsem9fhZp77sY+wcszudks8re8c3LobvHkTscRUNlx+0jNDzuU5WqYh+Z0trOez5vaR7H8c3kMyFv71W2+pi8dtzc0fxksy9XdR+l4djSCLMm8wocdlc4rmOptO1zHfp6qu+OvBkbSlR+iIrWuTviXW4QsmWdymUgwW47OK5h/qjHcovbhhE4xt0tvuswSFYeoyO2tPu+UW4Qsmecu2S+f2D0ceX4rJphK5rmtfKOUjiOgSsftAeH6SMtjlZMdbj2oSvZGzI6Hefya3RDZhzX/Y2K4/aC73nTcHpWTvWmVx6ogA9UnNjNyM1h5FJu7QQZn/sc8Sotj9Opsxre+VumASmDkEI38zpCXHXpfWLKznp2WcpnndLOJyMfws3kFmWypbi8N5Ll+69TTKZnblT8FyTxh/nwsT2TVVxiys569Dy6XMg8Gs4nIs77ZgN6zzWH9WcpOVK354thUwFu149Iq3aJls6y+ayPzBhqj7AGtj2I5COvePoq3T472puM2NbpTJU9k1eMIZd5A98/lLpvkj2K53LW9u5qHaDO+/YDEDqjuKEqrNMcy4Nts0SozJneZiZ1ZrfLUJU945/ZuqM7CNJD6re+xdoK5XcVLicquTD5/lpMq68SJucvMvzAvQeS+yp7J5W5Yf0Uqm9aG9QsBB1DtuH1I60SuWaruOpR7Y/qWpz6KZVud1d7P2dSfjsvzke6DSZmrB8RXMiajvZM7zhbPzivIE8Da5GhmLHdpJ/dCC9WOS2v14Dkpc/VjLXI/6Z6qjPZKzpDiZfMKj9nT+ldkJr3zHZd1q9v9+isycz/lRyTJewfnsublISH32Y1EPZ+SK8hja93GoYnAAdQ6LsXV6QF5dFf2RuRk/iLTbtDmUWzbbAK/GpkrKR4Jm/rTcXtv6P6oWarsO0nh87exZPlN7gV7/5h/Yu+NxkTZj3N3O+N21epitj+arSt5IqtM+Uut8uMK5U9Pci/Y+8eM/V2uxDVMqf/GgXldYG5XsfXaqbVsu5cnskqapfD5zZc/3Zt7JLt/zNhfGl+RjuRTojl7xdNpJ9/pRe/VOi7vYeo7M/KqspzxlY24OGWPZMgfxbJ3fmW25Oqu25oedVweoPpWr0yPljO+EqHicWr2vVZm7zJ7FMtumxxYuD45KvqQ8XrHZTZF41WZYjBkOymmy82fPs0mkdVPVq9UvjqZrqovUYZyhHonDzw0t6vcCym3++q7JYZsJ/qCzL4Im5lxZ8/d5q5ZyoZT/LVR7W4GDqvWcXvAQjYNbrfiPM5Ts92W77zLNvtebPtm+5RH/BfH1fWo4/bRlsXGvueXvz95bU6U37oq6S72wGVeQe6A8joKNuNv5T5tN9UCI+93aJCkzat8vcm8WrlzKmvU3AHZM5TdU8+f1WouV+WPLAzlefGjk/eFuWFlx2W/RDd12XlZ5tOFMq9W7tfIo8as3OyZXS5XPh62oeMIqN5x2SR1e5Q90PT1ajIYTmUfpbJvKnsjhkZeNvBt037ZK0r5TzzYJT27U+odl17pDIm87EifL8fm5bGMoPJUJC9bDI28HJ/WfByCpGv1kJQ6uTtaD4wMVdesPKmnj9PRYHxpF8t3QGSq29DhyDN+/c0EZZ/vbuW3lKY3cqFVNz8LZW5ZpcGyPeialafhVWK22on9GFPl95f16waye8Q+9335ilTQcQRU73hletB+VWmp8pF9+2+Kl5yS/i0Tn9mfKrr4YZh6x22is5PjLNC56vSI/JvidbTsnDYfrpM9vqu6ODtaD4wkWnetz7LP6qti11zIvyne2c02h4ZXXJr7QkdflJlbVum4JFpPXmTPUGpZ2XrtG+LFO7vZ5uDYS6HjCKjecTs9mDf5JtvvFvnvumWyvZHKu35bJj5lf6ymiw/kesft0WX5YYL2qwoy5dfgCdlrLx7FMq/QfLiO/UNN5T/UGWuBqUxjD+0LsUz+u24Z+yIsn2fJnq6bnqKS6jPZbPsRTadlblul4/Lxpnxtyhv4ufx33TJ2JyefZ7EvXV0HotBxBHSzSheVh6gcJ1fMoIwf7DdHp59P9f7Il1GXXyf9YB6ss8aNeDxb08WMmSaX37M+GMhxBcW7e2ePM1uij8d6pcbmFfcynzu3T4WNr0cedNiFTs6VmyZXj5i7Xqar4ln54inb15zf12/5uan9Z36p+uZQM7p9y3YG5m8Nb4N2hGlydfXdrdJlsWdz+Zo9Fb3f6hnq0mwmH/ml7ObQ9D53lbmbO/tVafj2RtPip9LjNO7mtP7xTKZfH4jhdD7t4vN3a5PptJvz+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9Npg8P8BdU4Z1dWeiLwAAAAASUVORK5CYII=",
							"isMetaFile": false,
							"width": 322.56,
							"height": 162,
							"iscrop": false,
							"name": "Picture 1",
							"alternativeText": "Chart, bar chart\n\nDescription automatically generated",
							"visible": true,
							"widthScale": 29.079107,
							"heightScale": 29.071333,
							"verticalPosition": -0.1,
							"verticalOrigin": "Paragraph",
							"verticalAlignment": "None",
							"horizontalPosition": -0.1,
							"horizontalOrigin": "Column",
							"horizontalAlignment": "None",
							"allowOverlap": true,
							"textWrappingStyle": "TopAndBottom",
							"textWrappingType": "Both",
							"layoutInCell": true,
							"zOrderPosition": 251658240
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "sdfsdfsdfsd"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "sdfsdf"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "sdfsdfs"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 2
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
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "fsdfsdf"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "sdfsdf"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
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
												"listFormat": {}
											},
											"characterFormat": {},
											"inlines": [
												{
													"characterFormat": {},
													"text": "dfsd"
												}
											]
										}
									],
									"cellFormat": {
										"borders": {
											"top": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"left": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"right": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"bottom": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalDown": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"diagonalUp": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"horizontal": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											},
											"vertical": {
												"hasNoneStyle": false,
												"lineStyle": "None",
												"lineWidth": 0
											}
										},
										"shading": {},
										"preferredWidth": 197.89999389648438,
										"preferredWidthType": "Point",
										"cellWidth": 197.89999389648438,
										"columnSpan": 1,
										"rowSpan": 1,
										"verticalAlignment": "Top"
									},
									"columnIndex": 2
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
										"lineWidth": 0
									},
									"left": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"right": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"bottom": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalDown": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"diagonalUp": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"horizontal": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									},
									"vertical": {
										"hasNoneStyle": false,
										"lineStyle": "None",
										"lineWidth": 0
									}
								},
								"gridBefore": 0,
								"gridAfter": 0
							}
						}
					],
					"grid": [
						197.89999389648438,
						197.89999389648438,
						197.89999389648438
					],
					"tableFormat": {
						"borders": {
							"top": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"left": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"right": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"bottom": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"diagonalDown": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"diagonalUp": {
								"hasNoneStyle": false,
								"lineStyle": "None",
								"lineWidth": 0
							},
							"horizontal": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							},
							"vertical": {
								"color": "#000000FF",
								"hasNoneStyle": false,
								"lineStyle": "Single",
								"lineWidth": 0.5
							}
						},
						"shading": {},
						"leftIndent": 0,
						"tableAlignment": "Left",
						"topMargin": 0,
						"rightMargin": 5.4,
						"leftMargin": 5.4,
						"bottomMargin": 0,
						"preferredWidthType": "Auto",
						"bidi": false,
						"allowAutoFit": true
					},
					"description": null,
					"title": null,
					"columnCount": 3
				},
				{
					"paragraphFormat": {
						"listFormat": {}
					},
					"characterFormat": {},
					"inlines": []
				}
			],
			"headersFooters": {}
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
		"afterSpacing": 8,
		"lineSpacing": 1.0791666507720948,
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
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
		},
		{
			"name": "Revision",
			"type": "Paragraph",
			"paragraphFormat": {
				"afterSpacing": 0,
				"lineSpacing": 1,
				"lineSpacingType": "Multiple",
				"listFormat": {}
			},
			"characterFormat": {},
			"next": "Revision"
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
					"listFormat": {}
				},
				"characterFormat": {},
				"inlines": []
			}
		]
	}
}
describe('Image with Wrappingstyle validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Top and Botton Style validation', () => {
        editor.open(JSON.stringify(imgdata));
		let para: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget
        let table: TableWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as TableWidget;
        
        expect(para.y < table.y).toBe(true);
    });
});
let spaceHeight: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":54,"rightMargin":54,"topMargin":41.04999923706055,"bottomMargin":72,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":25.200000762939453,"footerDistance":25.200000762939453,"bidi":false,"restartPageNumbering":true,"pageStartingNumber":1},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":22,"fontSizeBidi":22},"inlines":[{"characterFormat":{"fontSize":22,"fontSizeBidi":22},"text":"            "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"inlines":[{"characterFormat":{"fontSize":24,"fontSizeBidi":24},"text":"                       "},{"characterFormat":{"fontSize":9,"fontSizeBidi":9},"text":"Hello"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":48,"fontSizeBidi":48},"inlines":[{"characterFormat":{"fontSize":12,"fontSizeBidi":12},"text":"          "},{"characterFormat":{"fontSize":48,"fontSizeBidi":48},"text":"                  "}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"DPSTNR101","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Cambria","fontSizeBidi":11,"fontFamilyBidi":"Cambria"},"text":"0180731242 AE9"}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Arial","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2007","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level1","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level2","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontFamily":"Arial","underline":"Single","boldBidi":true,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level3","listFormat":{},"keepWithNext":true},"characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Normal","next":"Normal"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level4","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontSize":9,"boldBidi":true,"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","outlineLevel":"Level5","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"fontSize":8,"boldBidi":true,"fontSizeBidi":8},"basedOn":"Normal","next":"Normal"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","outlineLevel":"Level6","listFormat":{},"keepWithNext":true},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"DPSAR11BOLDCENTERCar","type":"Character","characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"DPSAR11BOLDCENTER","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11},"link":"DPSAR11BOLDCENTERCar","next":"DPSAR11BOLDCENTER"},{"name":"DPSAR11LISTNUMBERUPPERCASECar","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"DPSAR11LISTNUMBERUPPERCASE","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontColor":"#000000FF","fontSizeBidi":11},"link":"DPSAR11LISTNUMBERUPPERCASECar","next":"DPSAR11LISTNUMBERUPPERCASE"},{"name":"DPSTM10Column2Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTM10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTM10Column2Car","next":"DPSTM10Column2"},{"name":"DPSTMR10Column2Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTMR10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTMR10Column2Car","next":"DPSTMR10Column2"},{"name":"DPSTNR1011Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR1011","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR1011Car","next":"DPSTNR1011"},{"name":"DPSTNR1011ptCar","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR1011pt","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR1011ptCar","next":"DPSTNR1011pt"},{"name":"DPSTNR10RIGHTCar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10RIGHT","type":"Paragraph","paragraphFormat":{"textAlignment":"Right","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR10RIGHTCar","next":"DPSTNR10RIGHT"},{"name":"DPSTNR10UPPERCASECar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman","allCaps":true},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10UPPERCASE","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman","allCaps":true},"link":"DPSTNR10UPPERCASECar","next":"DPSTNR10UPPERCASE"},{"name":"DPSTNR11Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR11","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR11Car","next":"DPSTNR11"},{"name":"DPSTNR12Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR12","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"DPSTNR12Car","next":"DPSTNR12"},{"name":"DPSTNR8ArialnarrowArialNarrow8ptCar","type":"Character","characterFormat":{"fontSize":7,"fontFamily":"Arial Narrow","fontColor":"#000000FF","fontSizeBidi":7,"fontFamilyBidi":"Arial Narrow"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8ArialnarrowArialNarrow8pt","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":7,"fontFamily":"Arial Narrow","fontColor":"#000000FF","fontSizeBidi":7,"fontFamilyBidi":"Arial Narrow"},"link":"DPSTNR8ArialnarrowArialNarrow8ptCar","next":"DPSTNR8ArialnarrowArialNarrow8pt"},{"name":"DPSTNR8BoldCenteredCar","type":"Character","characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8BoldCentered","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{"bold":true,"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR8BoldCenteredCar","next":"DPSTNR8BoldCentered"},{"name":"Style023Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Style023","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"link":"Style023Car","next":"Style023"},{"name":"TableTextCar","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TableText","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"TableTextCar","next":"TableText"},{"name":"heading1Car","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"heading1","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"next":"heading1"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 1"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":11.050000190734863,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 2"},{"name":"TOC 3","type":"Paragraph","paragraphFormat":{"leftIndent":22.100000381469727,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 3"},{"name":"TOC 4","type":"Paragraph","paragraphFormat":{"leftIndent":32.900001525878906,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 4"},{"name":"TOC 5","type":"Paragraph","paragraphFormat":{"leftIndent":43.95000076293945,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 5"},{"name":"TOC 6","type":"Paragraph","paragraphFormat":{"leftIndent":55,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 6"},{"name":"TOC 7","type":"Paragraph","paragraphFormat":{"leftIndent":66.05000305175781,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 7"},{"name":"TOC 8","type":"Paragraph","paragraphFormat":{"leftIndent":77.0999984741211,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 8"},{"name":"TOC 9","type":"Paragraph","paragraphFormat":{"leftIndent":87.9000015258789,"afterSpacing":5,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontColor":"#000000FF","fontSizeBidi":10},"next":"TOC 9"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR10B01","type":"Paragraph","paragraphFormat":{"listFormat":{"listId":1}},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B01"},{"name":"DPSTNR101","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"next":"DPSTNR101"},{"name":"DPSTNR10B02","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B02"},{"name":"DPSTNR10B03","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B03"},{"name":"DPSTNR10B04","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"DPSTNR101","next":"DPSTNR10B04"},{"name":"DPSTNR10LISTNUMBER","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"DPSTNR10LISTNUMBER"},{"name":"DPSTNR10LIST","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"afterSpacing":0,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"List Continue","next":"DPSTNR10LIST"},{"name":"List Continue","type":"Paragraph","paragraphFormat":{"leftIndent":14.149999618530273,"afterSpacing":6,"listFormat":{}},"characterFormat":{},"basedOn":"DPSTNR101","next":"List Continue"},{"name":"DPSTNR10Column2","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"DPSTNR10Column2"},{"name":"DPSTNR10LISTLETTER","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"DPSTNR10LISTLETTER"},{"name":"Signature","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"listFormat":{}},"characterFormat":{"bold":true,"fontSize":30,"fontFamily":"Script","boldBidi":true,"fontSizeBidi":30,"fontFamilyBidi":"Script"},"next":"Signature"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Tahoma","fontSizeBidi":8,"fontFamilyBidi":"Tahoma"},"basedOn":"Default Paragraph Font"},{"name":"Salutation","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Block Text","type":"Paragraph","paragraphFormat":{"leftIndent":7.199999809265137,"rightIndent":7.199999809265137,"listFormat":{},"keepLinesTogether":true,"widowControl":false},"characterFormat":{"fontSize":14,"fontSizeBidi":14},"basedOn":"Normal","next":"Block Text"},{"name":"DPSTNR10 Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Re Caption","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"widowControl":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Re Caption"},{"name":"Body Text Left","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Body Text Left"},{"name":"Body Text Indent","type":"Paragraph","paragraphFormat":{"leftIndent":-27,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"Body Text Indent"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"rightIndent":-18,"listFormat":{},"tabs":[{"position":9,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":9,"boldBidi":true,"fontSizeBidi":9},"basedOn":"Normal","next":"Body Text 2"},{"name":"DPSTNR10","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR10Car","next":"DPSTNR10"},{"name":"DPSTNR10Car","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0000FFFF"},"basedOn":"Default Paragraph Font"},{"name":"Default","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Allstate Sans","fontColor":"#000000FF","fontFamilyBidi":"Allstate Sans"},"next":"Default"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Times New Roman","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Comment Text Char"},{"name":"Title","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","lineSpacing":24,"lineSpacingType":"AtLeast","listFormat":{},"tabs":[{"position":21.600000381469727,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Title"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"rightIndent":-40.5,"listFormat":{}},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Normal","next":"Body Text"},{"name":"Body Text Indent 2","type":"Paragraph","paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"lineSpacing":12,"lineSpacingType":"AtLeast","listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":108,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":144,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":180,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":216,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":252,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":288,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":324,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":360,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":396,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":504,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":540,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":576,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":612,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":648,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":684,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":720,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontSize":12,"fontSizeBidi":12},"basedOn":"Normal","next":"Body Text Indent 2"},{"name":"Body Text 3","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontSizeBidi":9},"basedOn":"Normal","next":"Body Text 3"},{"name":"heading11","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Times New Roman","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"link":"heading1Car","next":"heading11"},{"name":"BodyTextCentered","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":12,"lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"basedOn":"Body Text","next":"BodyTextCentered"},{"name":"BodyText00","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Century Schoolbook","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Century Schoolbook"},"basedOn":"Body Text","next":"BodyText00"},{"name":"BodyText00Bold","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"basedOn":"BodyText00","next":"BodyText00Bold"},{"name":"HeaderCenteredBold0012","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","lineSpacing":12,"lineSpacingType":"Exactly","listFormat":{},"tabs":[{"position":282,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":564,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"CG Times","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"CG Times"},"basedOn":"Normal","next":"HeaderCenteredBold0012"},{"name":"Plain Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#2F5496FF","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Normal","link":"Plain Text Char","next":"Plain Text"},{"name":"Plain Text Char","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#2F5496FF","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"Caption","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"DPSCOURRIERCar","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"DPSCOURRIER","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":10,"fontFamilyBidi":"Calibri"},"link":"DPSCOURRIERCar","next":"DPSCOURRIER"},{"name":"DPSTNR8Car","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"DPSTNR8","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontColor":"#000000FF","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"link":"DPSTNR8Car","next":"DPSTNR8"},{"name":"NormalSubCar","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"H1","type":"Paragraph","paragraphFormat":{"beforeSpacing":12,"listFormat":{"listId":0}},"characterFormat":{"fontSize":16,"fontColor":"#000000FF","fontSizeBidi":16},"next":"H1"},{"name":"H2","type":"Paragraph","paragraphFormat":{"leftIndent":36,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":1}},"characterFormat":{"fontSize":13,"fontColor":"#000000FF","fontSizeBidi":13},"next":"H2"},{"name":"H3","type":"Paragraph","paragraphFormat":{"leftIndent":72,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":2}},"characterFormat":{"fontColor":"#000000FF"},"next":"H3"},{"name":"H4","type":"Paragraph","paragraphFormat":{"leftIndent":108,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":3}},"characterFormat":{"fontColor":"#000000FF"},"next":"H4"},{"name":"H5","type":"Paragraph","paragraphFormat":{"leftIndent":144,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":4}},"characterFormat":{"fontColor":"#000000FF"},"next":"H5"},{"name":"H6","type":"Paragraph","paragraphFormat":{"leftIndent":180,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":5}},"characterFormat":{"fontColor":"#000000FF"},"next":"H6"},{"name":"H7","type":"Paragraph","paragraphFormat":{"leftIndent":216.0500030517578,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":6}},"characterFormat":{"fontColor":"#000000FF"},"next":"H7"},{"name":"H8","type":"Paragraph","paragraphFormat":{"leftIndent":252.0500030517578,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":7}},"characterFormat":{"fontColor":"#000000FF"},"next":"H8"},{"name":"H9","type":"Paragraph","paragraphFormat":{"leftIndent":288.04998779296875,"beforeSpacing":2,"listFormat":{"listId":0,"listLevelNumber":8}},"characterFormat":{"fontColor":"#000000FF"},"next":"H9"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":1,"levelOverrides":[],"listId":1}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"%1) ","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"%2) ","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"%3) ","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"(%4) ","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"(%5) ","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"(%6) ","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"Arabic","numberFormat":"%7. ","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowLetter","numberFormat":"%8. ","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"None","listLevelPattern":"LowRoman","numberFormat":"%9. ","restartLevel":8,"startAt":1}]},{"abstractListId":1,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":180,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":252,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":288,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":324,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Space height consideration validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Space height consideration validtaion', () => {
        editor.open(JSON.stringify(spaceHeight));
		let para1: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
		let para2: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[1] as ParagraphWidget;
		let para3: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget;
		expect(para1.height.toFixed()).toBe('34');
		expect(para2.height.toFixed()).toBe('14');
		expect(para3.height.toFixed()).toBe('73');
    });
});

describe('CompatibilityMode validtaion', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
	it('CompatibilityMode Word2013 validtaion', () => {
		let inputSfdt: any = {
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
								"textAlignment": "Justify",
								"afterSpacing": 18,
								"styleName": "Normal",
								"listFormat": {}
							},
							"characterFormat": {
								"fontFamily": "Calibri",
								"fontColor": "empty",
								"fontFamilyBidi": "Calibri"
							},
							"inlines": [
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "Gi"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "a"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "nt "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "pa"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "6"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "nda"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "u"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "s "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "ca"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "u"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "n "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "digest "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "bamboo "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "is "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "attributed "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "to "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "tiny "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "microbes "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "that "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "live "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "with"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "d"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "in "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "their "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "digestive "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "system. "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "As "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "they "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "can "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "only "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "digest "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "about "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "20% "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "of "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "hgh"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "what "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "they "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "eat, "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "the "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "average "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "gian"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "ad"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "t "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "pand"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"bidi": false,
										"fontFamilyBidi": "Calibri"
									},
									"text": "dsd"
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "a "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "consumes "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "around "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "14 "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "kilograms "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "(30 "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "pounds) "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "of "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "bamboo "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "a "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "day. "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "In "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "comparison, "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "humans "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "eat "
								},
								{
									"characterFormat": {
										"fontFamily": "Calibri",
										"fontColor": "empty",
										"fontFamilyBidi": "Calibri"
									},
									"text": "about "
								}
							]
						}
					],
					"headersFooters": {}
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
				"fontColor": "empty",
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
				"afterSpacing": 8,
				"lineSpacing": 1.0791666507720947,
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
						"afterSpacing": 0,
						"lineSpacing": 1,
						"lineSpacingType": "Multiple",
						"listFormat": {}
					},
					"characterFormat": {
						"fontSize": 12,
						"fontFamily": "Times New Roman",
						"fontColor": "empty",
						"fontSizeBidi": 12,
						"fontFamilyBidi": "Times New Roman"
					},
					"next": "Normal"
				}
			],
			"lists": [],
			"abstractLists": [],
			"comments": [],
			"revisions": [],
			"customXml": []
		}
		editor.open(JSON.stringify(inputSfdt));
		expect(editor.selection.start.paragraph.childWidgets.length).toBe(3);
	});
	it('Change CompatibilityMode Word2010 validtaion', (done) => {
		editor.documentSettings.compatibilityMode = "Word2010";
		setTimeout(() => {
			expect(editor.selection.start.paragraph.childWidgets.length).toBe(4);
			done();
		}, 100)
	});
	it('Change CompatibilityMode Word2013 validtaion', (done) => {
		editor.documentSettings.compatibilityMode = "Word2013";
		setTimeout(() => {
			expect(editor.selection.start.paragraph.childWidgets.length).toBe(3);
			done();
		}, 100)
	});
});
let pagebreak: any = {"sections":[{"sectionFormat":{"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"IN THE COUNTY COURT AT "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CROYDON"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":262,"preferredWidthType":"Point","cellWidth":262,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"textAlignment":"Right","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"       CLAIM NUMBER: "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<CLAIMNO>"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"    "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"rightMargin":0,"preferredWidth":197,"preferredWidthType":"Point","cellWidth":197,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"beforeSpacing":0.10000000149011612,"styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":22.549999237060547,"preferredWidthType":"Point","cellWidth":22.549999237060547,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":17.049999237060547,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0}}],"grid":[261.9999937735395,196.99999531827206,22.54999870115719],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidth":481.54998779296875,"preferredWidthType":"Point","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"PRAC Financial Limited"}]},{"paragraphFormat":{"textAlignment":"Right","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"CLAIMANT"}]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"-V-"}]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"Forename Surname"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"            "}]},{"paragraphFormat":{"textAlignment":"Right","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"DEFENDANT"}]},{"paragraphFormat":{"textAlignment":"Right","beforeSpacing":0.10000000149011612,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"styleName":"Normal","listFormat":{},"contextualSpacing":true,"widowControl":false},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"styleName":"Normal","listFormat":{},"contextualSpacing":true,"widowControl":false},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"text":"PARTICULARS OF CLAIM"}]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0.10000000149011612,"styleName":"Normal","listFormat":{},"contextualSpacing":true,"widowControl":false},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"Cleared","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":450.79998779296875,"preferredWidthType":"Point","cellWidth":450.79998779296875,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}}],"grid":[450.79998779296875],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":1},{"paragraphFormat":{"textAlignment":"Center","afterSpacing":6,"styleName":"Normal","listFormat":{},"widowControl":false},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"further "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Particulars "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claim "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"detailed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"below "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"are "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"provided "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"accordance "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Order "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"made "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Deputy"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"] "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"District "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Judge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"JUDGE"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"] "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"dated "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"DATE"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"]. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"these "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Particulars, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"makes "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reference "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"brief "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"number "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"documents "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attached."}]},{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"NB: "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ONLY "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attach "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"docs "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"POC "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(it’s "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"statement "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case) "},{"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Arial","underline":"Single","fontColor":"#FF0000FF","boldBidi":true,"italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"IF"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"i"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":") "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ordered "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"do "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"so, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ii) "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"particular "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"point "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"raised "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it’s "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"prudent "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"annex "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"SPECIFIC "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"doc, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"i"},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"e"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" notices "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"show "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"compliance "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"POFA "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"– "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"you "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attaching "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"all "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"docs "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","underline":"Single","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ever"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"]"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\u000b"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Annexed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"these "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Particulars "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"are "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"following "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"documents, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"referred "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"below:"}]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Arial","italicBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Document"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":214.5500030517578,"preferredWidthType":"Point","cellWidth":214.5500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Arial","italicBidi":true,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Page "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"numbers "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":210.6999969482422,"preferredWidthType":"Point","cellWidth":210.6999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftIndent":36.85}},{"cells":[{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Signage"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":214.5500030517578,"preferredWidthType":"Point","cellWidth":214.5500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":210.6999969482422,"preferredWidthType":"Point","cellWidth":210.6999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftIndent":36.85}},{"cells":[{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Notices "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":214.5500030517578,"preferredWidthType":"Point","cellWidth":214.5500030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":210.6999969482422,"preferredWidthType":"Point","cellWidth":210.6999969482422,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftIndent":36.85}}],"grid":[209.10110869643682,205.34888062241083],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":36.849998474121094,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"rightIndent":4.25,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[]},{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"facts "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"claim"}]},{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":true},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claim "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"£"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"1850.00"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#7030A0FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":") "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"due "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"specified "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Notice "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":") "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"c"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ontravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"occurred "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<offenceDate>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contravention "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Date"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":") "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<carParkStreet>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#7030A0FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<carParkName>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" ("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":")."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"authorised "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"enforce "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Signage "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":") "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"under "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"agreement "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"landowner/managing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"agent. "}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"As "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Date, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"registered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"keeper "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and/or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"driver "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"vehicle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"bearing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"vehicle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"registration "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"mark "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<registrationNumber>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" ("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Vehicle"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":")"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parked "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Date."}]},{"paragraphFormat":{"leftIndent":36.849998474121094,"firstLineIndent":-36.849998474121094,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contract"}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"As "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Date, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"there "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sufficient "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"adequate "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"signage "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"brought "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"any "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"motorist "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(including "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"driver "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Vehicle) "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"who "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"private "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"As "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"per "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"annexed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Signage, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"subject "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"inter "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"alia"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":", "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"state:"}]},{"paragraphFormat":{"firstLineIndent":-36.54999923706055,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"SET "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"OUT "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ALL "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"RELEVANT "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"TERMS"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"]"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"position "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"these "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"offer "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"lawfully "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"binding "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"licence "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contract) "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"between "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"clearly "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"communicated "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"via "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"signage. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"driver, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"exiting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasonable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"consideration "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"period, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"deemed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"accepted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"bound "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"same, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"including "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"obligation "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge. "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"submits "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"into "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contract "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"displayed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"following "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasons: "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"signage "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"so "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"obvious "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"they "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"must "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"read "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"accepted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"act "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"part "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"performance/their "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"conduct; "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"places "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reliance "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"judgment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"appeal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"-"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Vehicle "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Control "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Services "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Limited "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"v "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Alfred "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charles "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Crutchley "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[2017]. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"In "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"His "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Honour "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Judge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Wood "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"QC "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"decided "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that:"}]},{"paragraphFormat":{"leftIndent":36.849998474121094,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"“"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"It "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incumbent, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"my "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"judgment, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"person "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entering "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"private "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"property, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"when "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"clear "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contractual "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"licence "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"provided, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"understand "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"terms "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"such "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"licence. "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"It "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"would "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"onerous "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"oppressive, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"although "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"probably "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"inconvenient, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"visitor "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"establish "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"those "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"terms "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"conditions "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"before "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entering "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"business "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"park "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"first "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"place, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"even "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"required "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"remaining "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"outside, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entering "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"foot, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"when "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contents "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"notices "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"combination, "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"would "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"become "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"apparent”"}]},{"paragraphFormat":{"leftIndent":36.849998474121094,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\f"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Consideration"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"provided "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"consideration "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contract "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"granting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"permission "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"use "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"private "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"subject "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"compliance "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"above. "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Breach "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"On "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Date, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breached "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"y "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<offence>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":".   "}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breach "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"led "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issuing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"annexed. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"affixed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Vehicle/posted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"registered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"keeper. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"required "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paid "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"NUMBER"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"] "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"days, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"discounted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paid "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"14 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"days "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractually"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Prescribed "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Period "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"“CPP”"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":")."}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"how "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"appeal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"could "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"filed. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"No "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"appeal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"received "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant/An "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"appeal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"was "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"received "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"SET "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"OUT "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"DETAIL"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"]."}]},{"paragraphFormat":{"rightIndent":4.199999809265137,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(Claimant’s "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"additional "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs)"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Court "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"will "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"note "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"base "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"annexed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"signage "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"page "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PAGE"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"], "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"clearly "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"states: "}]},{"paragraphFormat":{"leftIndent":36,"textAlignment":"Justify","styleName":"Normal","listFormat":{},"widowControl":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"“"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"WORDING "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"RE "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ADDITIONAL "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CHARGES"},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"].”"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"construction "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"part "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contract "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"between "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"driver "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"up "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"so "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paid "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"accordance "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"agrees "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"additional "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incurred) "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"). "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issued "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"its "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"notices, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"inviting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"discounted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"discount "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"period, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"allowing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sufficient "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"time "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"appeal, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"default "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"thereafter, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"had "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incur "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"additional "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pursuing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"outstanding "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"business "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"collecting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issuing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"proceedings. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Their "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"business "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"predominantly "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"providing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"scheme "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"generating "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"profit.  "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"When "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"levied "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"result "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"user’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breach "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contract, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"specified "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"amount "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"That "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"what "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"covers. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"It "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"does "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"accommodate "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"eventualities "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"user’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"failure "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay."}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontColor":"#000000FF"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Once "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"expired, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"necessarily "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incurred "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charges "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"instructing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"solicitors "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recover "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"unpaid "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"BW "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Legal. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"BW "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"carries "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"extensive "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pre-legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"process "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"seeks "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"settle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"cases "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"without "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"need "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"litigation "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"line "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Pre-Action "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Protocol "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claims. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Having "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"instructed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"6 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"November "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"2020"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":", "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"prior"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claim "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issued "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<claimIssuedDate>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":", "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"BW "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"undertook "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"following "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"work "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"behalf "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant: "}]},{"paragraphFormat":{"leftIndent":36.849998474121094,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Carrying "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"validation "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(i.e. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"correct "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"name, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"address, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"vehicle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"registration, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"vehicle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"make, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"model, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"park, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"material "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"dates, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contravention "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"details "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"description "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"etc.) "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"conflict "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"checks "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"matter "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"upon "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"receipt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"instruction "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Tracing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"using "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reputable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"trace "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"bureau, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"confirm "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"address "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"verification "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"additional "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"traces "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"so "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"required "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"residency "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"particular "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"address "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"could "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"verified);"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Sending "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"initial "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"letter "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"quality "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"checked "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"prior "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issue;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Multiple "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attempts "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contacting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"telephone "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"specifically "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"trained "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"staff, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"post, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"other "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contact "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"points "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"via "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"email "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"SMS "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"available;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Sending "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pre-action "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"protocol "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"compliant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"letter "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"claim "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(also "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"quality "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"checked, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contains "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"full "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"response "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pack, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"income "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"expenditure "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"form "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"information "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sheet);"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Dealing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"any "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"responses/queries/dispute/contact "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"including "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"liaising "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"further "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"instructions;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Dealing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"any "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"requests "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"documents, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"via "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"queries, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"subject "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"access "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"requests "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"via "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"complaints;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Reviewing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"affordability "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"offer "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"repayment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"plan "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"considered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"current "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"circumstances;]"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Maintaining "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"plan "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"over "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"time, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"involved "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"additional "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"monitor "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"process "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payments;]"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Working "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"understand "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"deal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"any "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"underlying "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"circumstances "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"would "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"class "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"them "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"vulnerable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"we "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"needed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"refer "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"upon "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"receiving "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"consent "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"share "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"such "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"information. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"re, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"resulted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"further "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"correspondences "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"both "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"attempt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"resolve "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"matter;]"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Handling "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"interloper, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"forum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"letters "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"along "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"any "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"threats "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"media, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"correspondence "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"local "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"MPs;]"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Referring "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charities, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"other "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"organisations "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"they "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"were "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"suffering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"financial "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"hardship "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"could "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"afford "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"advice;] "}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Dealing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"nominated "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Third "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"party "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"also "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"involved "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sending "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"further "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"correspondence "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"keep "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"them "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"informed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"about "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"progression "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"matter;]"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Carrying "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pre-litigation "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"review "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"includes "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reviewing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"matter’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"prospects "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"success, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"considering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"evidence, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"history "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"taking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"further "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"instructions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant;"}]},{"paragraphFormat":{"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Drafting "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"issuing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claim."}]},{"paragraphFormat":{"leftIndent":72,"textAlignment":"Justify","lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"inlines":[]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"innocent "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"party, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"therefore "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"suffered "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"financial "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"loss "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"direct "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"failure "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"failing "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"perform "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"their "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"obligations "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paying "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"It "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"therefore "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"follows "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"indemnify "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"these "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"fact "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"clause "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entitling "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"default "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"genuine "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\u000b"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pre-estimate "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"loss, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"regarded "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"deterrent "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"against "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breach, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"does "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"mean "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"penalty "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"unfair. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"because:"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"clause "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"made "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"known "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"motorist "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"motorist "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"option "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"declining "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"after "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Car "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Park "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasonable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"period, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"along "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"rest "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"offer;"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"are "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"only "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"where "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incur "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"ie"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"motorist "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"declines "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"comply "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"then "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"subsequently "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"declines "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"discounted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"offered), "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"then "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"subsequently "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"declines "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"all;"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Objectively, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasonable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"party "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"who "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"enforce "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reimbursed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"enforcement."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"therefore, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"with "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"itself, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"act "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"deterrent, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"encourage "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"non-payers "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"avoiding "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"until "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"final "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"hurdle "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"collection "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pre-legal "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"stage. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Beyond "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"incurred "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"expense "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"having "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"do "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"above, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"whereas "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"unjustly "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"no "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"worse "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"position "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paying "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"CPP."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Whilst "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"actual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"quantified "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"signage, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"it "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"does "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"negate "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"term "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"there "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"case "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"authority "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"support "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"claims "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"where "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"such "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"specified. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"It "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"submitted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"above, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"should "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"objectively "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"assessed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"on "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"quantum "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"meirut"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" basis "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"against "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"description "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"work "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"set "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"out "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"above. "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"In "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"addition, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"using "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[British "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Association’s/International "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Community’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Code "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Practice "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"("},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Code"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"):"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Under "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paragraph "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"19.9 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Code, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"required "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"warn "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"drivers "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"they "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"delay "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"beyond "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payment "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"period "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"28 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"days "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"they "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"needed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"take "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"court "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"action "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"use "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"methods "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recover "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"there "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"extra "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"‘recovery’ "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"charges "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"action. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Under "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paragraph "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"23.1b "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Code, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"where "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"becomes "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"overdue "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"before "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Court "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Proceedings "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"commenced, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasonable "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(which "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"covers "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"cost "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovering "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt) "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"added "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"fees. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"must "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"exceed "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"£70 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"unless "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"prior "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"approval "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"BPA "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"has "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"granted.]"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[Part "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"E, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Schedule "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"5 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"-"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" Parking "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charges "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"states: "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"“Where "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Parking "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"becomes "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"overdue "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"reasonable "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"added. "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"This "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"sum "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"must "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"not "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"exceed "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"£60 "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"(inclusive "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"VAT "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"where "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"applicable) "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"unless "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Court "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Proceedings "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"have "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"been "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"initiated"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"”.]"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"therefore "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"fall "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"scope "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Accredited "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Trade "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Association’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Code, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"being "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"organisation "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"approved "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Secretary "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"State."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Particulars "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Loss"}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"stipulated "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"upon "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breach "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"same, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"would "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"payable. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"PCN "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"discounted "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"if "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"paid "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"[14]"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" days."}]},{"paragraphFormat":{"leftIndent":35.45000076293945,"rightIndent":4.199999809265137,"firstLineIndent":-35.45000076293945,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"As "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"result "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Defendant’s "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"breach "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"above, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"is "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"entitled "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"seek "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"following: "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Contractual "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Charge, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"as "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"referred "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"within "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Terms "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"and "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Conditions. "}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Debt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Recovery "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"£"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"["},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"      ]"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Statutory "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Interest "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"pursuant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Section "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"69 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"County "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Courts "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Act "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"1984 "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"at "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"rate "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"8% "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"per "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"annum "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"from "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#FF0000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<offenceDate>"},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":";"}]},{"paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Costs."}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","underline":"Single","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","underline":"Single","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Statement "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","underline":"Single","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","underline":"Single","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Truth"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"believes "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"the "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"facts "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"stated "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"this "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Particulars "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claim "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"are "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"true. "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"The "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"understands "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"that "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"proceedings "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"for "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"contempt "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"court "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"may "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"brought "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"against "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"anyone "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"who "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"makes, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"or "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"causes "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"to "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"be "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"made, "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"false statement in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"document "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"verified "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"by "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"a statement of truth without "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"an "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"honest "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"belief "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"in "},{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"its truth."}]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"inlines":[{"characterFormat":{"fontColor":"#000000FF"},"text":" "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":64.5,"preferredWidthType":"Point","cellWidth":64.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"<"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"documentSignaturePlaceholder"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":">"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":394.6499938964844,"preferredWidthType":"Point","cellWidth":394.6499938964844,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":16.200000762939453,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0.75,"topMargin":0.75,"rightMargin":0.75,"bottomMargin":0.75}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"SIGNED"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":64.5,"preferredWidthType":"Point","cellWidth":64.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#000000FF"},"inlines":[{"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"………………..………………………….……."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":394.6499938964844,"preferredWidthType":"Point","cellWidth":394.6499938964844,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":0.6000000238418579,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"gridBefore":0,"gridAfter":0,"leftMargin":0.75,"topMargin":0.75,"rightMargin":0.75,"bottomMargin":0.75}}],"grid":[64.28928367393212,393.3607040236692],"tableFormat":{"borders":{"top":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":true,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#F2F3F8FF","foregroundColor":"empty","textureStyle":"TextureNone"},"leftIndent":-6.349999904632568,"tableAlignment":"Left","topMargin":0.75,"rightMargin":0.75,"leftMargin":0.75,"bottomMargin":0.75,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":true},"description":null,"title":null,"columnCount":2},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"\u000b"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Full "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"name:"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Przemyslaw "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Smolana"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Name "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"of "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Claimant’s "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Solicitor’s "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Firm: "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"BW "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Legal "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Services "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Limited"}]},{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"Dated: "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"28"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"October"},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"text":"2021"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"basedOn":"Normal","link":"Heading 1 Char","next":"Heading 1"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listId":1,"listLevelNumber":1}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"basedOn":"Normal","link":"Heading 2 Char","next":"Heading 2"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{"listId":1,"listLevelNumber":2}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"basedOn":"Normal","link":"Heading 3 Char","next":"Heading 3"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{"listId":1,"listLevelNumber":3}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"basedOn":"Normal","link":"Heading 4 Char","next":"Heading 4"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"firstLineIndent":-36,"textAlignment":"Justify","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{"listId":1,"listLevelNumber":4}},"characterFormat":{"fontSize":11,"fontSizeBidi":11},"basedOn":"Normal","link":"Heading 5 Char","next":"Heading 5"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level6","listFormat":{"listLevelNumber":5}},"characterFormat":{},"basedOn":"Heading 5","link":"Heading 6 Char","next":"Heading 6"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 7","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level7","listFormat":{"listLevelNumber":6}},"characterFormat":{},"basedOn":"Heading 6","link":"Heading 7 Char","next":"Heading 7"},{"name":"Heading 7 Char","type":"Character","characterFormat":{"fontFamily":"Times New Roman","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 8","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","outlineLevel":"Level8","listFormat":{"listId":1,"listLevelNumber":7},"keepWithNext":true},"characterFormat":{"bold":true,"fontSize":11,"boldBidi":true,"fontSizeBidi":11,"allCaps":true},"basedOn":"Normal","link":"Heading 8 Char","next":"Normal"},{"name":"Heading 8 Char","type":"Character","characterFormat":{"bold":true,"fontFamily":"Times New Roman","boldBidi":true,"fontFamilyBidi":"Times New Roman","allCaps":true},"basedOn":"Default Paragraph Font"},{"name":"Heading 9","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level9","listFormat":{"listLevelNumber":8}},"characterFormat":{"allCaps":false},"basedOn":"Heading 8","link":"Heading 9 Char","next":"Normal"},{"name":"Heading 9 Char","type":"Character","characterFormat":{"bold":true,"fontFamily":"Times New Roman","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Times New Roman","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontFamily":"Times New Roman","fontSizeBidi":8,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Normal (Web)","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal (Web)"}],"lists":[{"abstractListId":0,"levelOverrides":[{"levelNumber":0,"startAt":1},{"levelNumber":1,"startAt":1},{"levelNumber":2,"startAt":1},{"levelNumber":3,"startAt":1},{"levelNumber":4,"startAt":1},{"levelNumber":5,"startAt":1},{"levelNumber":6,"startAt":1},{"levelNumber":7,"startAt":1},{"levelNumber":8,"startAt":1}],"listId":1}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Arial","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36.849998474121094,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"(%5)","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"(%6)","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-36.849998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"(%7)","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"firstLineIndent":-36,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"firstLineIndent":-36,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Page break layouting validation due to widow/orphan property', () => {
	let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Page break layouting validation due to widow/orphan property', () => {
        editor.open(JSON.stringify(pagebreak));
		let fisrtText: TextElementBox = (((editor.documentHelper.pages[2].bodyWidgets[0].lastChild as ParagraphWidget).lastChild as LineWidget).children[0] as TextElementBox);
		let lastText: TextElementBox = (((editor.documentHelper.pages[2].bodyWidgets[0].lastChild as ParagraphWidget).lastChild as LineWidget).children[11] as TextElementBox);
		expect(fisrtText.text).toBe('covers. ');
		expect(lastText.text).toBe('pay.');
	});
});
let hyphen: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":90,"rightMargin":90,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"PR-"},{"characterFormat":{},"text":"test"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":33.75,"preferredWidthType":"Point","cellWidth":33.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"hyphenation"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":226.8000030517578,"preferredWidthType":"Point","cellWidth":226.8000030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Russian-"},{"characterFormat":{},"text":"English"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":56.70000076293945,"preferredWidthType":"Point","cellWidth":56.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":33.75,"preferredWidthType":"Point","cellWidth":33.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":226.8000030517578,"preferredWidthType":"Point","cellWidth":226.8000030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":56.70000076293945,"preferredWidthType":"Point","cellWidth":56.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":33.75,"preferredWidthType":"Point","cellWidth":33.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":226.8000030517578,"preferredWidthType":"Point","cellWidth":226.8000030517578,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"empty","foregroundColor":"empty","textureStyle":"TextureNone"},"preferredWidth":56.70000076293945,"preferredWidthType":"Point","cellWidth":56.70000076293945,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0}}],"grid":[33.75,226.8000030517578,56.70000076293945],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":true,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Hyphen consideration on spliting validtaion inside table', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
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
    it('Hyphen consideration on spliting validtaion inside table', () => {
        editor.open(JSON.stringify(hyphen));
		let textElementBox: TextElementBox = (((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox;
		let textElementBox1: TextElementBox = (((((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets[2] as TableCellWidget).childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox;
		expect(textElementBox.text.indexOf('-')).toBe(textElementBox.text.length - 1);
		expect(textElementBox1.text.indexOf('-')).toBe(textElementBox1.text.length - 1);
    });
});
// let hyphenation: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Justify","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Text "},{"characterFormat":{},"text":"documentation "},{"characterFormat":{},"text":"to "},{"characterFormat":{},"text":"check "},{"characterFormat":{},"text":"the "},{"characterFormat":{},"text":"hyphen-"},{"characterFormat":{},"text":"ation"},{"characterFormat":{},"text":" for "},{"characterFormat":{},"text":"Document "},{"characterFormat":{},"text":"editor, "},{"characterFormat":{},"text":"Text "},{"characterFormat":{},"text":"document "},{"characterFormat":{},"text":"to "},{"characterFormat":{},"text":"check "},{"characterFormat":{},"text":"hyphen-"},{"characterFormat":{},"text":"ation"},{"characterFormat":{},"text":" Text "},{"characterFormat":{},"text":"document "},{"characterFormat":{},"text":"to "},{"characterFormat":{},"text":"check "},{"characterFormat":{},"text":"the "},{"characterFormat":{},"text":"hyphenation "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Document "},{"characterFormat":{},"text":"editor  "}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
// describe('Hyphen consideration on spliting validtaion', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         document.body.innerHTML = '';
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Selection, Editor);
//         editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         document.body.innerHTML = '';
//         setTimeout(() => {
//             done();
//         }, 1000);
//     });
//     it('Hyphen consideration on spliting validtaion', () => {
// 		editor.open(JSON.stringify(hyphenation));
// 		let line: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
// 		let textElementBox: TextElementBox = line.children[line.children.length - 1] as TextElementBox;
// 		expect(textElementBox.text.indexOf('-')).toBe(textElementBox.text.length - 1);
//     });
// });