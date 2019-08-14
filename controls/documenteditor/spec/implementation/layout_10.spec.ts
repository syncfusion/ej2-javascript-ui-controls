import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer, ParagraphWidget, LineWidget, TextElementBox, ListTextElementBox, TableCellWidget, WBorder } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

let footerJson: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 45.349998474121094,
                "rightMargin": 45.349998474121094,
                "topMargin": 48.25,
                "bottomMargin": 48.25,
                "differentFirstPage": true,
                "differentOddAndEvenPages": false,
                "headerDistance": 36,
                "footerDistance": 5.050000190734863,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 234,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 468,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 512.0499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 521.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 7,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 7
                                    },
                                    "text": "Copyright 2015 American Land Title Association"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "."
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "File # "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "SSRSTestFile"
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 283.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 522,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 7,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 7
                                    },
                                    "text": "All rights reserved."
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "Page "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 0,
                                    "fieldCodeType": "FieldPage"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " PAGE \\* Arabic "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " of "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 0,
                                    "fieldCodeType": "FieldNumPages"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " NUMPAGES \\* Arabic "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "Printed on: 04/16/19 02:47 PM"
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 283.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 522,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 234,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 468,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 512.0499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [{}]
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 521.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 7,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 7
                                    },
                                    "text": "Copyright 2015 American Land Title Association"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "."
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "File # "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "SSRSTestFile"
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 283.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 522,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "fontSize": 7,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 7
                                    },
                                    "text": "All rights reserved."
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "Page "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 0,
                                    "fieldCodeType": "FieldPage"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " PAGE \\* Arabic "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " of "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 0,
                                    "fieldCodeType": "FieldNumPages"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": " NUMPAGES \\* Arabic "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "1"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 1
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "Printed on: 04/16/19 02:47 "
                                },
                                {
                                    "characterFormat": {
                                        "fontSize": 10,
                                        "fontFamily": "Calibri",
                                        "fontSizeBidi": 10
                                    },
                                    "text": "PM"
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "leftIndent": 1,
                                "afterSpacing": 0,
                                "lineSpacing": 12,
                                "lineSpacingType": "Exactly",
                                "styleName": "[Normal]",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 1,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 283.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Center",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 522,
                                        "deletePosition": 0,
                                        "tabJustification": "Right",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 569,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 625.9000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 682.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 739.7000122070312,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 796.5499877929688,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 853.5,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 910.4000244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 967.25,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1024.1500244140625,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1081.050048828125,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 1138,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    }
                                ]
                            },
                            "characterFormat": {
                            },
                            "inlines": [
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
        "fontColor": "#000000FF",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Calibri"
    },
    "paragraphFormat": {
        "leftIndent": 0,
        "rightIndent": 0,
        "firstLineIndent": 0,
        "textAlignment": "Left",
        "beforeSpacing": 0,
        "afterSpacing": 10,
        "lineSpacing": 1,
        "lineSpacingType": "Multiple",
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 56.70000076293945,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 0,
                "outlineLevel": "Level1",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF"
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
                "fontColor": "#2F5496FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF"
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
                "fontColor": "#2F5496FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level3",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF"
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
                "fontColor": "#1F3763FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF"
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
                "fontColor": "#2F5496FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level5",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF"
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
                "fontColor": "#2F5496FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level6",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF"
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
                "fontColor": "#1F3763FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "[Normal]",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Arial",
                "fontSizeBidi": 12
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Body Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontSizeBidi": 12
            },
            "basedOn": "Normal"
        },
        {
            "name": "Body Text Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontColor": "#000000FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 234,
                        "deletePosition": 0,
                        "tabJustification": "Center",
                        "tabLeader": "None"
                    },
                    {
                        "position": 468,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontColor": "#000000FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footer",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 234,
                        "deletePosition": 0,
                        "tabJustification": "Center",
                        "tabLeader": "None"
                    },
                    {
                        "position": 468,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontColor": "#000000FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 8,
                "fontSizeBidi": 8
            },
            "basedOn": "Normal"
        },
        {
            "name": "Balloon Text Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "fontSize": 8,
                "fontFamily": "Tahoma",
                "strikethrough": "None",
                "fontColor": "#000000FF",
                "fontSizeBidi": 8
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Body Text 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Body Text 2 Char",
            "type": "Character",
            "characterFormat": {
                "bold": false,
                "italic": false,
                "strikethrough": "None",
                "fontColor": "#000000FF"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [],
    "abstractLists": []
};

describe('Right Indent Tab layout', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(footerJson));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Footer Paragraphs children count', () => {
        expect((editor.viewer.pages[0].footerWidget.childWidgets[1] as ParagraphWidget).childWidgets.length).toBe(1);
    });
});
let list: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 70.8499984741211,
                "rightMargin": 70.8499984741211,
                "topMargin": 85.0999984741211,
                "bottomMargin": 85.0999984741211,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "leftIndent": 0,
                        "firstLineIndent": 0,
                        "beforeSpacing": 6,
                        "afterSpacing": 6,
                        "lineSpacing": 1,
                        "lineSpacingType": "Multiple",
                        "styleName": "Heading 1",
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 21.600000381469727,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc492735475"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc504968994"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc506327102"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc10195635"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "Autorisatie"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc10195635"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc492735475"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc504968994"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc506327102"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "textAlignment": "Right",
                                "styleName": "Header",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
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
        "fontFamily": "Montserrat",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman"
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
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 35.400001525878906,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -35.45000076293945,
                "beforeSpacing": 24,
                "afterSpacing": 24,
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 26
                }
            },
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -36,
                "beforeSpacing": 12,
                "afterSpacing": 12,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 18,
                "afterSpacing": 12,
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level4",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 3
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
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
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Title",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 36,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Title Char",
            "next": "Normal"
        },
        {
            "name": "Title Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 3,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Intense Quote Char",
            "next": "Quote"
        },
        {
            "name": "Intense Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 18,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 21
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Quote Char",
            "next": "Normal"
        },
        {
            "name": "Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtitle",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 25,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Subtitle Char",
            "next": "Normal"
        },
        {
            "name": "Subtitle Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Strong",
            "type": "Character",
            "characterFormat": {
                "bold": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Emphasis",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "No Spacing",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Subtle Emphasis",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Emphasis",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtle Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Book Title",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "TOC Heading",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "BodyText",
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 1",
            "next": "Normal"
        },
        {
            "name": "List Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 36,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal"
        },
        {
            "name": "annotation text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Comment Text Char"
        },
        {
            "name": "Comment Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Comment Subject Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Comment Text Char"
        },
        {
            "name": "annotation subject",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
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
            "name": "Balloon Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Normal",
            "link": "Balloon Text Char"
        },
        {
            "name": "TOC 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.25,
                "firstLineIndent": -21.25,
                "beforeSpacing": 12,
                "afterSpacing": 6,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 12,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ]
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 42.5,
                "firstLineIndent": -21.25,
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 42.54999923706055,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 70.9000015258789,
                "firstLineIndent": -28.350000381469727,
                "afterSpacing": 5,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 70.9000015258789,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 453.1000061035156,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0563C1FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Header Char",
            "next": "Normal"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
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
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Footer Char",
            "next": "Normal"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Document nog in bewerking",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "INHOUD",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.549999237060547,
                "firstLineIndent": -21.549999237060547,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontColor": "#FFFFFFFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Inleiding",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "beforeSpacing": 36,
                "afterSpacing": 48,
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontColor": "#44546AFF"
            },
            "basedOn": "Normal",
            "next": "Heading 2"
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
            "name": "Body Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "textAlignment": "Justify",
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 12,
                "lineSpacingType": "AtLeast",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Body Text Char"
        },
        {
            "name": "Body Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Uitgangspunt",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "Uitgangspunt Kop",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Intense Quote"
        },
        {
            "name": "Default",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri",
                "fontColor": "#000000FF",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Calibri"
            }
        },
        {
            "name": "Kop oranje briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 28
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#538135FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd vervolgregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 18,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "afterSpacing": 18,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd cursief",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true
            },
            "basedOn": "Kop briefhoofd"
        },
        {
            "name": "Kop briefhoofd begin- en eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 7
            },
            "basedOn": "Kop briefhoofd eindregel"
        },
        {
            "name": "Kop zwart briefhoofd - demi",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 9,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 7,
                "fontSizeBidi": 7,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Kop briefhoofd"
        },
        {
            "name": "TOC 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 33,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 44,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 55,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 66,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 77,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 88,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Tussenkop Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Tussenkop",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 6,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Tussenkop Char",
            "next": "Body Text"
        },
        {
            "name": "List Number",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 0
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "List Continue",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 14.149999618530273,
                "afterSpacing": 6,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "Lijn in document",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Lijn in document Char",
            "next": "Body Text"
        },
        {
            "name": "Lijn in document Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 7
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming Char"
        },
        {
            "name": "Opsomming Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming nummering",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 23
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming nummering Char"
        },
        {
            "name": "Opsomming nummering Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Placeholder Text",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#808080FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Table Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal"
        },
        {
            "name": "Revision",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            }
        },
        {
            "name": "Footnote Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10
            },
            "basedOn": "Normal",
            "link": "Footnote Text Char"
        },
        {
            "name": "Footnote Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footnote Reference",
            "type": "Character",
            "characterFormat": {
                "baselineAlignment": "Superscript"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Unresolved Mention",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#605E5CFF"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "listId": 0
        },
        {
            "abstractListId": 6,
            "listId": 6
        },
        {
            "abstractListId": 7,
            "listId": 7
        },
        {
            "abstractListId": 21,
            "listId": 21
        },
        {
            "abstractListId": 23,
            "listId": 23
        },
        {
            "abstractListId": 26,
            "listId": 26
        },
        {
            "abstractListId": 28,
            "listId": 28
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 1,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 2,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 6,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 7,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontColor": "#939905FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#808080FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 21,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 198,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 234,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 270,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 306,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 23,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -24.700000762939453,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 77.4000015258789,
                        "firstLineIndent": -34.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 26,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 21.600000381469727,
                        "firstLineIndent": -21.600000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.799999237060547,
                        "firstLineIndent": -28.799999237060547,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.20000076293945,
                        "firstLineIndent": -43.20000076293945,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 50.400001525878906,
                        "firstLineIndent": -50.400001525878906,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 57.599998474121094,
                        "firstLineIndent": -57.599998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 64.80000305175781,
                        "firstLineIndent": -64.80000305175781,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -72,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.19999694824219,
                        "firstLineIndent": -79.19999694824219,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 28,
            "levels": [
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#70AD47FF",
                        "fontSizeBidi": 8
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.350000381469727,
                        "firstLineIndent": -28.350000381469727,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 28.350000381469727,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Courier New",
                        "fontFamilyBidi": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.650001525878906,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 43.650001525878906,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 79.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 115.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 115.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 151.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 151.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 187.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 187.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 223.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 223.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 259.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 259.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 295.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 295.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "Dot"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        }
    ]
};
describe('List tab justification', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(list));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('List Tab justification', () => {
        expect(Math.round(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBe(17);
    });
});

let styleJson: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 70.8499984741211,
                "rightMargin": 70.8499984741211,
                "topMargin": 85.0999984741211,
                "bottomMargin": 85.0999984741211,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 21,
                                "deletePosition": 0,
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
                        "fontColor": "#808080FF"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "TOC 1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "fontFamily": "Montserrat",
                        "fontColor": "#00000000",
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "fieldType": 0
                        },
                        {
                            "characterFormat": {
                            },
                            "text": " TOC \\o \"1-2\" \\h \\z \\u "
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 0
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "HYPERLINK \\l \"_Toc10195635\""
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "styleName": "Hyperlink",
                                "fontSizeBidi": 9
                            },
                            "text": "1"
                        },
                        {
                            "characterFormat": {
                                "fontFamily": "Montserrat",
                                "fontColor": "#00000000",
                                "fontFamilyBidi": "Times New Roman"
                            },
                            "text": "\t"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 9,
                                "styleName": "Hyperlink",
                                "fontSizeBidi": 9
                            },
                            "text": "Autorisatie"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "\t"
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 0
                        },
                        {
                            "characterFormat": {
                            },
                            "text": " PAGEREF _Toc10195635 \\h "
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "3"
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {
                            },
                            "fieldType": 1
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "textAlignment": "Right",
                                "styleName": "Header",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
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
        "fontFamily": "Montserrat",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman"
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
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 35.400001525878906,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -35.45000076293945,
                "beforeSpacing": 24,
                "afterSpacing": 24,
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 26
                }
            },
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -36,
                "beforeSpacing": 12,
                "afterSpacing": 12,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 18,
                "afterSpacing": 12,
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level4",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 3
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
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
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Title",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 36,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Title Char",
            "next": "Normal"
        },
        {
            "name": "Title Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 3,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Intense Quote Char",
            "next": "Quote"
        },
        {
            "name": "Intense Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 18,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 21
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Quote Char",
            "next": "Normal"
        },
        {
            "name": "Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtitle",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 25,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Subtitle Char",
            "next": "Normal"
        },
        {
            "name": "Subtitle Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Strong",
            "type": "Character",
            "characterFormat": {
                "bold": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Emphasis",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "No Spacing",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Subtle Emphasis",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Emphasis",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtle Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Book Title",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "TOC Heading",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "BodyText",
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 1",
            "next": "Normal"
        },
        {
            "name": "List Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 36,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal"
        },
        {
            "name": "annotation text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Comment Text Char"
        },
        {
            "name": "Comment Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Comment Subject Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Comment Text Char"
        },
        {
            "name": "annotation subject",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
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
            "name": "Balloon Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Normal",
            "link": "Balloon Text Char"
        },
        {
            "name": "TOC 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.25,
                "firstLineIndent": -21.25,
                "beforeSpacing": 12,
                "afterSpacing": 6,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 12,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ]
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 42.5,
                "firstLineIndent": -21.25,
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 42.54999923706055,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 70.9000015258789,
                "firstLineIndent": -28.350000381469727,
                "afterSpacing": 5,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 70.9000015258789,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 453.1000061035156,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0563C1FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Header Char",
            "next": "Normal"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
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
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Footer Char",
            "next": "Normal"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Document nog in bewerking",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "INHOUD",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.549999237060547,
                "firstLineIndent": -21.549999237060547,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontColor": "#FFFFFFFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Inleiding",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "beforeSpacing": 36,
                "afterSpacing": 48,
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontColor": "#44546AFF"
            },
            "basedOn": "Normal",
            "next": "Heading 2"
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
            "name": "Body Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "textAlignment": "Justify",
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 12,
                "lineSpacingType": "AtLeast",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Body Text Char"
        },
        {
            "name": "Body Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Uitgangspunt",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "Uitgangspunt Kop",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Intense Quote"
        },
        {
            "name": "Default",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri",
                "fontColor": "#000000FF",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Calibri"
            }
        },
        {
            "name": "Kop oranje briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 28
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#538135FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd vervolgregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 18,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "afterSpacing": 18,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd cursief",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true
            },
            "basedOn": "Kop briefhoofd"
        },
        {
            "name": "Kop briefhoofd begin- en eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 7
            },
            "basedOn": "Kop briefhoofd eindregel"
        },
        {
            "name": "Kop zwart briefhoofd - demi",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 9,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 7,
                "fontSizeBidi": 7,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Kop briefhoofd"
        },
        {
            "name": "TOC 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 33,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 44,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 55,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 66,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 77,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 88,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Tussenkop Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Tussenkop",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 6,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Tussenkop Char",
            "next": "Body Text"
        },
        {
            "name": "List Number",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 0
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "List Continue",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 14.149999618530273,
                "afterSpacing": 6,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "Lijn in document",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Lijn in document Char",
            "next": "Body Text"
        },
        {
            "name": "Lijn in document Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 7
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming Char"
        },
        {
            "name": "Opsomming Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming nummering",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 23
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming nummering Char"
        },
        {
            "name": "Opsomming nummering Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Placeholder Text",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#808080FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Table Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal"
        },
        {
            "name": "Revision",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            }
        },
        {
            "name": "Footnote Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10
            },
            "basedOn": "Normal",
            "link": "Footnote Text Char"
        },
        {
            "name": "Footnote Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footnote Reference",
            "type": "Character",
            "characterFormat": {
                "baselineAlignment": "Superscript"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Unresolved Mention",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#605E5CFF"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "listId": 0
        },
        {
            "abstractListId": 6,
            "listId": 6
        },
        {
            "abstractListId": 7,
            "listId": 7
        },
        {
            "abstractListId": 21,
            "listId": 21
        },
        {
            "abstractListId": 23,
            "listId": 23
        },
        {
            "abstractListId": 26,
            "listId": 26
        },
        {
            "abstractListId": 28,
            "listId": 28
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 1,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 2,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 6,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 7,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontColor": "#939905FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#808080FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 21,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 198,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 234,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 270,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 306,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 23,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -24.700000762939453,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 77.4000015258789,
                        "firstLineIndent": -34.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 26,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 21.600000381469727,
                        "firstLineIndent": -21.600000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.799999237060547,
                        "firstLineIndent": -28.799999237060547,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.20000076293945,
                        "firstLineIndent": -43.20000076293945,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 50.400001525878906,
                        "firstLineIndent": -50.400001525878906,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 57.599998474121094,
                        "firstLineIndent": -57.599998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 64.80000305175781,
                        "firstLineIndent": -64.80000305175781,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -72,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.19999694824219,
                        "firstLineIndent": -79.19999694824219,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 28,
            "levels": [
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#70AD47FF",
                        "fontSizeBidi": 8
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.350000381469727,
                        "firstLineIndent": -28.350000381469727,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 28.350000381469727,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Courier New",
                        "fontFamilyBidi": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.650001525878906,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 43.650001525878906,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 79.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 115.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 115.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 151.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 151.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 187.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 187.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 223.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 223.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 259.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 259.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 295.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 295.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        }
    ]
};
describe('Right Indent Tab layout 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(styleJson));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Paragraphs children count', () => {
        expect((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(1);
    });
});

let listJson: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 70.8499984741211,
                "rightMargin": 70.8499984741211,
                "topMargin": 85.0999984741211,
                "bottomMargin": 85.0999984741211,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Heading 1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc492735475"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc504968994"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc506327102"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc10195636"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "Documentbeheer"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc492735475"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc504968994"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc506327102"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc10195636"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "textAlignment": "Right",
                                "styleName": "Header",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Footer",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
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
        "fontFamily": "Montserrat",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Times New Roman"
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
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 35.400001525878906,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -35.45000076293945,
                "beforeSpacing": 24,
                "afterSpacing": 24,
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 26
                }
            },
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 18,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "firstLineIndent": -36,
                "beforeSpacing": 12,
                "afterSpacing": 12,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 18,
                "afterSpacing": 12,
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level4",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 3
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 5 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 6 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#233148FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 0,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 26,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
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
                "fontSize": 9,
                "italicBidi": true,
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Title",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 36,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Title Char",
            "next": "Normal"
        },
        {
            "name": "Title Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 26,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 26,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 12,
                "afterSpacing": 3,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Intense Quote Char",
            "next": "Quote"
        },
        {
            "name": "Intense Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#FFFFFFFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Quote",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 18,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 21
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "link": "Quote Char",
            "next": "Normal"
        },
        {
            "name": "Quote Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#44546AFF",
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtitle",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 25,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Subtitle Char",
            "next": "Normal"
        },
        {
            "name": "Subtitle Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontColor": "#595959FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Strong",
            "type": "Character",
            "characterFormat": {
                "bold": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Emphasis",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "No Spacing",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "Subtle Emphasis",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Emphasis",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#172030FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Subtle Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Intense Reference",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true,
                "fontColor": "#2F4261FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Book Title",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "italic": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "TOC Heading",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "BodyText",
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 1",
            "next": "Normal"
        },
        {
            "name": "List Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 36,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal"
        },
        {
            "name": "annotation text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Comment Text Char"
        },
        {
            "name": "Comment Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Comment Subject Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Comment Text Char"
        },
        {
            "name": "annotation subject",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
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
            "name": "Balloon Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Normal",
            "link": "Balloon Text Char"
        },
        {
            "name": "TOC 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.25,
                "firstLineIndent": -21.25,
                "beforeSpacing": 12,
                "afterSpacing": 6,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ]
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Montserrat ExtraBold",
                "fontColor": "#44546AFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 42.5,
                "firstLineIndent": -21.25,
                "beforeSpacing": 5,
                "afterSpacing": 0,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 42.54999923706055,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 481.8999938964844,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 70.9000015258789,
                "firstLineIndent": -28.350000381469727,
                "afterSpacing": 5,
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 70.9000015258789,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    },
                    {
                        "position": 453.1000061035156,
                        "deletePosition": 0,
                        "tabJustification": "Right",
                        "tabLeader": "Dot"
                    }
                ],
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0563C1FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Header Char",
            "next": "Normal"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
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
                "listFormat": {
                },
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
            "characterFormat": {
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Footer Char",
            "next": "Normal"
        },
        {
            "name": "Footer Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Document nog in bewerking",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "INHOUD",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 21.549999237060547,
                "firstLineIndent": -21.549999237060547,
                "beforeSpacing": 5,
                "afterSpacing": 10,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontColor": "#FFFFFFFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Inleiding",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "beforeSpacing": 36,
                "afterSpacing": 48,
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontColor": "#44546AFF"
            },
            "basedOn": "Normal",
            "next": "Heading 2"
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
            "name": "Body Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 35.45000076293945,
                "textAlignment": "Justify",
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 12,
                "lineSpacingType": "AtLeast",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Body Text Char"
        },
        {
            "name": "Body Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Verdana",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Uitgangspunt",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Quote"
        },
        {
            "name": "Uitgangspunt Kop",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Intense Quote"
        },
        {
            "name": "Default",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri",
                "fontColor": "#000000FF",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Calibri"
            }
        },
        {
            "name": "Kop oranje briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 28
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontColor": "#538135FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd vervolgregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 18,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "firstLineIndent": 17.850000381469727,
                "afterSpacing": 18,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "tabs": [
                    {
                        "position": 28.350000381469727,
                        "deletePosition": 0,
                        "tabJustification": "Left",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontSize": 7,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 8,
                "fontFamilyBidi": "Times New Roman"
            }
        },
        {
            "name": "Kop briefhoofd cursief",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true
            },
            "basedOn": "Kop briefhoofd"
        },
        {
            "name": "Kop briefhoofd begin- en eindregel",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 7
            },
            "basedOn": "Kop briefhoofd eindregel"
        },
        {
            "name": "Kop zwart briefhoofd - demi",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 17.850000381469727,
                "beforeSpacing": 6,
                "afterSpacing": 9,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 7,
                "fontSizeBidi": 7,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Kop briefhoofd"
        },
        {
            "name": "TOC 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 33,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 44,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 55,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 66,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 77,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 88,
                "afterSpacing": 5,
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Tussenkop Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Tussenkop",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 6,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "bold": true,
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Tussenkop Char",
            "next": "Body Text"
        },
        {
            "name": "List Number",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 0
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "List Continue",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 14.149999618530273,
                "afterSpacing": 6,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal"
        },
        {
            "name": "Lijn in document",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Lijn in document Char",
            "next": "Body Text"
        },
        {
            "name": "Lijn in document Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 7
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming Char"
        },
        {
            "name": "Opsomming Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Opsomming nummering",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "listFormat": {
                    "listId": 23
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontFamily": "Arial"
            },
            "basedOn": "Normal",
            "link": "Opsomming nummering Char"
        },
        {
            "name": "Opsomming nummering Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Placeholder Text",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#808080FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Table Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11
            },
            "basedOn": "Normal"
        },
        {
            "name": "Revision",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial"
            }
        },
        {
            "name": "Footnote Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSizeBidi": 10
            },
            "basedOn": "Normal",
            "link": "Footnote Text Char"
        },
        {
            "name": "Footnote Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footnote Reference",
            "type": "Character",
            "characterFormat": {
                "baselineAlignment": "Superscript"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Unresolved Mention",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#605E5CFF"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "listId": 0
        },
        {
            "abstractListId": 6,
            "listId": 6
        },
        {
            "abstractListId": 7,
            "listId": 7
        },
        {
            "abstractListId": 21,
            "listId": 21
        },
        {
            "abstractListId": 23,
            "listId": 23
        },
        {
            "abstractListId": 26,
            "listId": 26
        },
        {
            "abstractListId": 28,
            "listId": 28
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 1,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 2,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 6,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -42.54999923706055,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 7,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontColor": "#939905FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#808080FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontColor": "#00000000"
                    },
                    "paragraphFormat": {
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "-",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 21,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol",
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 54,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 126,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 162,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 198,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 234,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
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
                        "leftIndent": 270,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 306,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        },
        {
            "abstractListId": 23,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 18,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 42.54999923706055,
                        "firstLineIndent": -24.700000762939453,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 77.4000015258789,
                        "firstLineIndent": -34.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 113.4000015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 113.4000015258789,
                        "firstLineIndent": 0,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "None",
                    "numberFormat": "",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 26,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 21.600000381469727,
                        "firstLineIndent": -21.600000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.799999237060547,
                        "firstLineIndent": -28.799999237060547,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.20000076293945,
                        "firstLineIndent": -43.20000076293945,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 50.400001525878906,
                        "firstLineIndent": -50.400001525878906,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 57.599998474121094,
                        "firstLineIndent": -57.599998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 64.80000305175781,
                        "firstLineIndent": -64.80000305175781,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -72,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamilyBidi": "Times New Roman"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.19999694824219,
                        "firstLineIndent": -79.19999694824219,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%1.%2.%3.%4.%5.%6.%7.%8.%9",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 28,
            "levels": [
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Wingdings",
                        "fontColor": "#70AD47FF",
                        "fontSizeBidi": 8
                    },
                    "paragraphFormat": {
                        "leftIndent": 28.350000381469727,
                        "firstLineIndent": -28.350000381469727,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 28.350000381469727,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Courier New",
                        "fontFamilyBidi": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 43.650001525878906,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 43.650001525878906,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 79.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 115.6500015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 115.6500015258789,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 151.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 151.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 187.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 187.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 223.64999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 223.64999389648438,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
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
                        "leftIndent": 259.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 259.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Wingdings"
                    },
                    "paragraphFormat": {
                        "leftIndent": 295.6499938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        },
                        "tabs": [
                            {
                                "position": 295.6499938964844,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        }
    ]
};
describe('List tab justification 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableSelection: true, enableEditor: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(listJson));
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('List Tab justification', () => {
        expect(Math.round(((editor.viewer.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBe(35);
    });
});