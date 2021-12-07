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