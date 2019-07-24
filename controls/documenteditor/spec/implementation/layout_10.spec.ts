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