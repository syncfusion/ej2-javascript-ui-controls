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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(footerJson));
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
    it('Footer Paragraphs children count', () => {
console.log('Footer Paragraphs children count');
        expect((editor.documentHelper.pages[0].footerWidget.childWidgets[1] as ParagraphWidget).childWidgets.length).toBe(1);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(list));
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
    it('List Tab justification', () => {
console.log('List Tab justification');
        expect(Math.round(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBe(17);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(styleJson));
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
    it('Paragraphs children count', () => {
console.log('Paragraphs children count');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets.length).toBe(1);
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
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(listJson));
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
    it('List Tab justification', () => {
console.log('List Tab justification');
        expect(Math.round(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBe(35);
    });
});

var listDocument: any = {"sections":[{"sectionFormat":{"pageWidth":595,"pageHeight":842,"leftMargin":70.8499984741211,"rightMargin":70.8499984741211,"topMargin":70.8499984741211,"bottomMargin":70.8499984741211,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Heading 1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Toc511665392"},{"characterFormat":{},"text":"Introduction"},{"characterFormat":{},"bookmarkType":1,"name":"_Toc511665392"}]},{"paragraphFormat":{"textAlignment":"Justify","styleName":"Heading 2","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Toc511665393"},{"characterFormat":{},"text":"Purpose "},{"characterFormat":{},"text":"and "},{"characterFormat":{},"text":"scope"},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_Toc511665393"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":14.199999809265137,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":28.399999618530273,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":42.599998474121094,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":56.79999923706055,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":71,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":85.19999694824219,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":99.4000015258789,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":113.5999984741211,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":273.04998779296875,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"}]}]},"footer":{"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"fieldCodeType":"FieldPage"},{"characterFormat":{},"text":" PAGE   \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"1"},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"LOREM ISPUM GroUp"}]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"fieldCodeType":"FieldDate"},{"characterFormat":{},"text":" DATE   \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"8/26/2019"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"text":" "}]},{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":14.199999809265137,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":true},"characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontSizeBidi":10},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"afterSpacing":18,"outlineLevel":"Level1","listFormat":{"listId":8},"contextualSpacing":false},"characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#EB5015FF"},"basedOn":"Normal","link":"Heading 1 Char","next":"Heading 2"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":28.799999237060547,"beforeSpacing":16,"afterSpacing":6,"outlineLevel":"Level2","listFormat":{"listId":8,"listLevelNumber":1}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"EY Bulleted List 3","link":"Heading 2 Char","next":"Body"},{"name":"EY Bulleted List 3","type":"Paragraph","paragraphFormat":{"leftIndent":90,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","listFormat":{"listId":17,"listLevelNumber":2},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"EYInterstate Light","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Body","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"link":"Body Char"},{"name":"Body Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"beforeSpacing":10,"afterSpacing":10,"outlineLevel":"Level3","listFormat":{"listId":8,"listLevelNumber":2}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 3 Char","next":"Body"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","boldBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":43.20000076293945,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"fontSize":11,"fontColor":"#EB501FFF","italicBidi":true},"basedOn":"Heading 3","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#EB501FFF","boldBidi":true,"italicBidi":true,"fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level5","listFormat":{"listId":8,"listLevelNumber":4}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#ED7D31FF","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#ED7D31FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level6","listFormat":{"listId":8,"listLevelNumber":5}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F4D78FF","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#1F4D78FF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 7","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level7","listFormat":{"listId":8,"listLevelNumber":6}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#1F4D78FF","italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 7 Char","next":"Normal"},{"name":"Heading 7 Char","type":"Character","characterFormat":{"italic":true,"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#1F4D78FF","italicBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 8","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level8","listFormat":{"listId":8,"listLevelNumber":7}},"characterFormat":{"fontSize":10.5,"fontFamily":"Calibri Light","fontColor":"#272727FF","fontSizeBidi":10.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 8 Char","next":"Normal"},{"name":"Heading 8 Char","type":"Character","characterFormat":{"fontSize":10.5,"fontFamily":"Calibri Light","fontColor":"#272727FF","fontSizeBidi":10.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Heading 9","type":"Paragraph","paragraphFormat":{"beforeSpacing":2,"outlineLevel":"Level9","listFormat":{"listId":8,"listLevelNumber":8}},"characterFormat":{"italic":true,"fontSize":10.5,"fontFamily":"Calibri Light","fontColor":"#272727FF","italicBidi":true,"fontSizeBidi":10.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Heading 9 Char","next":"Normal"},{"name":"Heading 9 Char","type":"Character","characterFormat":{"italic":true,"fontSize":10.5,"fontFamily":"Calibri Light","fontColor":"#272727FF","italicBidi":true,"fontSizeBidi":10.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Title","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":true},"characterFormat":{"fontSize":32,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","fontSizeBidi":36},"link":"Title Char"},{"name":"Title Char","type":"Character","characterFormat":{"fontSize":32,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","fontSizeBidi":36},"basedOn":"Default Paragraph Font"},{"name":"Subtitle","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":true},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":14},"link":"Subtitle Char"},{"name":"Subtitle Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":14},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{}},"characterFormat":{},"basedOn":"Normal"},{"name":"Bullet List","type":"Paragraph","paragraphFormat":{"leftIndent":22.700000762939453,"firstLineIndent":-14.199999809265137,"afterSpacing":6,"lineSpacing":1.100000023841858,"lineSpacingType":"Multiple","listFormat":{"listId":24}},"characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"link":"Bullet List Char"},{"name":"Bullet List Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"basedOn":"Body Char"},{"name":"Number List","type":"Paragraph","paragraphFormat":{"leftIndent":22.700000762939453,"firstLineIndent":-14.199999809265137,"listFormat":{"listId":3}},"characterFormat":{},"basedOn":"Bullet List","link":"Number List Char"},{"name":"Number List Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"basedOn":"Bullet List Char"},{"name":"TOC Heading","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":15,"fontFamily":"Calibri Light","fontColor":"#EB5015FF","fontSizeBidi":10}},{"name":"TOC 1","type":"Paragraph","paragraphFormat":{"leftIndent":28.350000381469727,"firstLineIndent":-28.350000381469727,"afterSpacing":6,"listFormat":{},"tabs":[{"position":22.700000762939453,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":450.8500061035156,"deletePosition":0,"tabJustification":"Right","tabLeader":"Underscore"}]},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontColor":"#F15C29FF","boldBidi":true},"basedOn":"Normal"},{"name":"TOC 2","type":"Paragraph","paragraphFormat":{"leftIndent":42.54999923706055,"firstLineIndent":-28.350000381469727,"afterSpacing":6,"listFormat":{},"tabs":[{"position":44,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":450.8500061035156,"deletePosition":0,"tabJustification":"Right","tabLeader":"Underscore"}]},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#404040FF"},"basedOn":"Normal"},{"name":"TOC 3","type":"Paragraph","paragraphFormat":{"leftIndent":56.70000076293945,"firstLineIndent":-28.350000381469727,"afterSpacing":12,"listFormat":{},"tabs":[{"position":450.75,"deletePosition":0,"tabJustification":"Right","tabLeader":"Underscore"}]},"characterFormat":{"fontColor":"#404040FF","italicBidi":true},"basedOn":"Normal"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0563C1FF"},"basedOn":"Default Paragraph Font"},{"name":"TOC 4","type":"Paragraph","paragraphFormat":{"leftIndent":33,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"TOC 5","type":"Paragraph","paragraphFormat":{"leftIndent":44,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"TOC 6","type":"Paragraph","paragraphFormat":{"leftIndent":55,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"TOC 7","type":"Paragraph","paragraphFormat":{"leftIndent":66,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"TOC 8","type":"Paragraph","paragraphFormat":{"leftIndent":77,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"TOC 9","type":"Paragraph","paragraphFormat":{"leftIndent":88,"listFormat":{}},"characterFormat":{"fontSizeBidi":9},"basedOn":"Normal","next":"Normal"},{"name":"Sub Bullet List","type":"Paragraph","paragraphFormat":{"leftIndent":36.849998474121094,"firstLineIndent":-8.5,"listFormat":{"listId":13}},"characterFormat":{},"basedOn":"Bullet List","link":"Sub Bullet List Char"},{"name":"Sub Bullet List Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#404040FF","fontSizeBidi":10},"basedOn":"Bullet List Char"},{"name":"Header","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{},"basedOn":"Footer","link":"Header Char","next":"Normal"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"#7F7F7FFF"},"basedOn":"Normal","link":"Footer Char","next":"Normal"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#7F7F7FFF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light","fontColor":"#7F7F7FFF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"List Continue","type":"Paragraph","paragraphFormat":{"leftIndent":18,"afterSpacing":6,"listFormat":{}},"characterFormat":{},"basedOn":"Normal"},{"name":"Index 1","type":"Paragraph","paragraphFormat":{"leftIndent":11,"firstLineIndent":-11,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"},{"name":"Index Heading","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Calibri Light","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Index 1"},{"name":"List Number","type":"Paragraph","paragraphFormat":{"listFormat":{"listId":0}},"characterFormat":{},"basedOn":"Normal"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Placeholder Text","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"},{"name":"Inline Header","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#404040FF"},"basedOn":"Normal","link":"Inline Header Char"},{"name":"Inline Header Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri","fontColor":"#404040FF","fontSizeBidi":10},"basedOn":"Body Char"},{"name":"Footnote Text","type":"Paragraph","paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontColor":"#595959FF"},"basedOn":"Normal","link":"Footnote Text Char"},{"name":"Footnote Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Calibri Light","fontColor":"#595959FF","fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"Footnote Reference","type":"Character","characterFormat":{"baselineAlignment":"Superscript"},"basedOn":"Default Paragraph Font"},{"name":"Caption","type":"Paragraph","paragraphFormat":{"afterSpacing":10,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"italic":true,"fontSize":9,"fontFamily":"Calibri Light","fontColor":"#404040FF","italicBidi":true,"fontSizeBidi":9},"next":"Normal"},{"name":"Normal TM","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Normal TM Char"},{"name":"Normal TM Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#000000FF","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Figure Heading","type":"Paragraph","paragraphFormat":{"leftIndent":10.100000381469727,"firstLineIndent":-10.100000381469727,"textAlignment":"Center","lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":25},"contextualSpacing":false},"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Calibri Light","fontColor":"#808080FF","fontSizeBidi":9,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":9,"fontSizeBidi":9},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Cambria","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Comment Text Char"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Cambria","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"beforeSpacing":0,"listFormat":{},"contextualSpacing":true},"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri Light","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri Light","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Comment Text Char"},{"name":"Footnote Text1","type":"Paragraph","paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":8,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Tahoma"},"basedOn":"Normal"},{"name":"Bullit List (1)","type":"Paragraph","paragraphFormat":{"leftIndent":35.70000076293945,"firstLineIndent":-17.850000381469727,"listFormat":{"listId":5}},"characterFormat":{"fontColor":"#00000000","fontSizeBidi":12},"basedOn":"Normal TM"},{"name":"Bullit List (2)","type":"Paragraph","paragraphFormat":{"listFormat":{"listId":30}},"characterFormat":{"fontColor":"#00000000","fontSizeBidi":12},"basedOn":"Normal TM"},{"name":"Table Heading","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{"listId":16},"tabs":[{"position":56.70000076293945,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Calibri Light","fontColor":"#808080FF","fontSizeBidi":9},"basedOn":"Normal TM","next":"Normal TM"},{"name":"Numbered List","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":21.25,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"contextualSpacing":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"TM Header style","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"italic":true,"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal TM Accent","link":"TM Header style Char"},{"name":"Normal TM Accent","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Normal TM Accent Char","next":"Normal TM"},{"name":"Normal TM Accent Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontColor":"#0072BAFF","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TM Header style Char","type":"Character","characterFormat":{"italic":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TM Page Number Style","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","listFormat":{}},"characterFormat":{},"basedOn":"Normal TM Accent","link":"TM Page Number Style Char"},{"name":"TM Page Number Style Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontColor":"#0072BAFF","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Source","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"italic":true,"fontSize":9,"fontColor":"#808080FF","fontSizeBidi":9},"basedOn":"Normal TM","next":"Normal TM"},{"name":"All Caps","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"link":"All Caps Char","next":"Normal"},{"name":"All Caps Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"All caps bold","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"link":"All caps bold Char","next":"Normal"},{"name":"All caps bold Char","type":"Character","characterFormat":{"bold":true,"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Bullet list","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":27},"contextualSpacing":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Bullet list Char"},{"name":"Bullet list Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Emphasis","type":"Character","characterFormat":{"italic":true,"italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"FollowedHyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#A84D08FF"},"basedOn":"Default Paragraph Font"},{"name":"No Spacing","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"link":"No Spacing Char"},{"name":"No Spacing Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Numbered list","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":11,"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Numbered list Char"},{"name":"Numbered list Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Quote","type":"Paragraph","paragraphFormat":{"leftIndent":43.20000076293945,"rightIndent":43.20000076293945,"textAlignment":"Center","beforeSpacing":10,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"Arial","fontColor":"#404040FF","italicBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Quote Char","next":"Normal"},{"name":"Quote Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Arial","fontColor":"#404040FF","italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Strong","type":"Character","characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Style Bold","type":"Character","characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Style Bold Italic","type":"Character","characterFormat":{"bold":true,"italic":true,"boldBidi":true,"italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Style Italic","type":"Character","characterFormat":{"italic":true,"italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Style Italic Underline","type":"Character","characterFormat":{"italic":true,"underline":"Single","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Style Superscript","type":"Character","characterFormat":{"baselineAlignment":"Superscript"},"basedOn":"Default Paragraph Font"},{"name":"Style Underline","type":"Character","characterFormat":{"underline":"Single"},"basedOn":"Default Paragraph Font"},{"name":"TM Author & Publication date syle","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":6,"afterSpacing":3,"outlineLevel":"Level2","listFormat":{},"contextualSpacing":false},"characterFormat":{"bold":true,"fontSize":14,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Subtitle","link":"TM Author & Publication date syle Char"},{"name":"TM Author & Publication date syle Char","type":"Character","characterFormat":{"bold":true,"fontSize":14,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TM Even Header style","type":"Paragraph","paragraphFormat":{"textAlignment":"Right","listFormat":{}},"characterFormat":{},"basedOn":"TM Header style","link":"TM Even Header style Char","next":"Normal TM"},{"name":"TM Even Header style Char","type":"Character","characterFormat":{"italic":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TM Table Styling (use this for tables)","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"link":"TM Table Styling (use this for tables) Char"},{"name":"TM Table Styling (use this for tables) Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Intense Reference","type":"Character","characterFormat":{"bold":true,"fontFamily":"Arial","fontColor":"#00000000","boldBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Intense Quote","type":"Paragraph","paragraphFormat":{"leftIndent":43.20000076293945,"rightIndent":43.20000076293945,"textAlignment":"Center","beforeSpacing":18,"afterSpacing":18,"listFormat":{}},"characterFormat":{"italic":true,"italicBidi":true},"basedOn":"Normal TM Accent","link":"Intense Quote Char","next":"Normal"},{"name":"Intense Quote Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Arial","fontColor":"#0072BAFF","italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Intense Emphasis","type":"Character","characterFormat":{"italic":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#00000000","italicBidi":true,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"standaard uitvullen","type":"Paragraph","paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":18,"fontFamily":"Calibri","fontColor":"#535353FF","fontSizeBidi":12,"fontFamilyBidi":"Verdana"},"basedOn":"Normal","link":"000 Char1 Char Char Char"},{"name":"000 Char1 Char Char Char","type":"Character","characterFormat":{"fontSize":18,"fontFamily":"Calibri","fontColor":"#535353FF","fontSizeBidi":12,"fontFamilyBidi":"Verdana"},"basedOn":"Default Paragraph Font"},{"name":"NormaalTM Teken","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Kop1TM Teken","type":"Character","characterFormat":{"bold":true,"fontSize":14,"fontFamily":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"List Arabic 2","type":"Paragraph","paragraphFormat":{"leftIndent":71.8499984741211,"lineSpacing":1.1999999284744263,"lineSpacingType":"Multiple","listFormat":{"listId":29,"listLevelNumber":1},"tabs":[{"position":2.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"CG Times","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Body Text 2"},{"name":"Body Text 2","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":2,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Body Text 2 Char"},{"name":"Body Text 2 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Kop2TM Teken","type":"Character","characterFormat":{"bold":true,"italic":true,"fontSize":11,"fontFamily":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Kop4TM Teken","type":"Character","characterFormat":{"italic":true,"fontSize":10,"fontFamily":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Kop3TM Teken","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"List","type":"Paragraph","paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"Revision","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Cambria","fontFamilyBidi":"Times New Roman"}},{"name":"Body Text Indent","type":"Paragraph","paragraphFormat":{"leftIndent":36,"lineSpacing":14,"lineSpacingType":"Exactly","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Body Text Indent Char"},{"name":"Body Text Indent Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"TPA Normal","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"TPA Normal Char Char"},{"name":"TPA Normal Char Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Block Text","type":"Paragraph","paragraphFormat":{"leftIndent":28.350000381469727,"rightIndent":28.350000381469727,"firstLineIndent":35.45000076293945,"afterSpacing":6,"lineSpacing":18,"lineSpacingType":"AtLeast","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"Table Column Heading 10pt","type":"Paragraph","paragraphFormat":{"textAlignment":"Center","beforeSpacing":3,"afterSpacing":3,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Table Column Heading 10pt Char"},{"name":"Table Column Heading 10pt Char","type":"Character","characterFormat":{"bold":true,"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Table Text 10pt","type":"Paragraph","paragraphFormat":{"beforeSpacing":1,"afterSpacing":1,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"(F2) Brödtext","type":"Paragraph","paragraphFormat":{"leftIndent":56.70000076293945,"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"List Bullet","type":"Paragraph","paragraphFormat":{"leftIndent":24,"firstLineIndent":-24,"lineSpacing":14,"lineSpacingType":"AtLeast","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"ING_BodyText","type":"Paragraph","paragraphFormat":{"afterSpacing":4,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":9.5,"fontFamily":"Calibri","fontSizeBidi":9.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"ING_Level1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":9}},"characterFormat":{"bold":false,"fontSize":18,"fontColor":"#00000000","boldBidi":true,"fontSizeBidi":18,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 1","next":"Normal"},{"name":"ING_Level3","type":"Paragraph","paragraphFormat":{"beforeSpacing":9,"afterSpacing":4,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"BodyText","listFormat":{"listId":9,"listLevelNumber":2},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"italic":true,"fontSize":9.5,"fontColor":"#00000000","boldBidi":false,"italicBidi":true,"fontSizeBidi":9.5,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 2","next":"ING_BodyText"},{"name":"ING_Level2Numbered","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":3,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{"listId":9,"listLevelNumber":1},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"contextualSpacing":false},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"Calibri","boldBidi":true,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"ING_Level4","type":"Paragraph","paragraphFormat":{"outlineLevel":"Level3","listFormat":{}},"characterFormat":{},"basedOn":"ING_Level3","next":"ING_BodyText"},{"name":"Bullet 1","type":"Paragraph","paragraphFormat":{"afterSpacing":10,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":2},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Bullet 1 Char"},{"name":"Bullet 1 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Body Text","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Body Text Char"},{"name":"Body Text Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Page Number","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"EY Bulleted List 1","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","listFormat":{"listId":17},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"EYInterstate Light","italicBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"EY Bulleted List 1 Char"},{"name":"EY Bulleted List 1 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"EYInterstate Light","italicBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"EY Bulleted List 2","type":"Paragraph","paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"beforeSpacing":6,"afterSpacing":12,"lineSpacing":1.5,"lineSpacingType":"Multiple","listFormat":{"listId":17,"listLevelNumber":1},"tabs":[{"position":0,"deletePosition":78.55,"tabJustification":"Left","tabLeader":"None"},{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}],"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"EYInterstate Light","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"Instructions - body text","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"afterSpacing":6,"lineSpacing":1.5,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontColor":"#0000FFFF","italicBidi":true,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Instructions - body text Char","next":"Normal"},{"name":"Instructions - body text Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri","fontColor":"#0000FFFF","italicBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"EY Heading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":12,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":1},"tabs":[{"position":0,"deletePosition":42.5,"tabJustification":"Left","tabLeader":"None"},{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":false,"fontSize":20,"fontFamily":"EYInterstate Light","fontColor":"#7F7E82FF","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Arial"},"basedOn":"Heading 1","next":"Normal"},{"name":"EY Heading 2","type":"Paragraph","paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":1}},"characterFormat":{"italic":true,"fontSize":11,"fontFamily":"EYInterstate Light","fontColor":"#00000000","boldBidi":false,"fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 2","link":"EY Heading 2 Char","next":"Normal"},{"name":"EY Heading 2 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"EYInterstate Light","fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"EY Heading 3","type":"Paragraph","paragraphFormat":{"afterSpacing":6,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":1},"contextualSpacing":false},"characterFormat":{"fontSize":10,"fontFamily":"EYInterstate","fontColor":"#00000000","fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 3","link":"EY Heading 3 Char","next":"Normal"},{"name":"EY Heading 3 Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"EYInterstate","boldBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"EY Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":143.85000610351562,"firstLineIndent":-18,"outlineLevel":"Level4","listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontSize":11,"fontFamily":"EYInterstate Light","boldBidi":false,"fontSizeBidi":12},"basedOn":"EY Heading 3"},{"name":"Normal (Web)","type":"Paragraph","paragraphFormat":{"beforeSpacing":5,"afterSpacing":11.25,"lineSpacing":18,"lineSpacingType":"AtLeast","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontSize":12,"fontFamily":"Arial","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Normal"},{"name":"Table Numbered List","type":"Paragraph","paragraphFormat":{"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{"listId":15},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":21.25,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}],"contextualSpacing":false},"characterFormat":{"fontFamily":"Arial","fontSizeBidi":11,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal"},{"name":"Default","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":12,"fontFamilyBidi":"Arial"}},{"name":"headings 3","type":"Paragraph","paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"textAlignment":"Justify","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{"listId":-1,"listLevelNumber":0},"contextualSpacing":false},"characterFormat":{"bold":true,"italic":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#0072BAFF","fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 3","link":"headings 3 Char"},{"name":"headings 3 Char","type":"Character","characterFormat":{"bold":true,"italic":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#0072BAFF","boldBidi":true,"fontSizeBidi":13,"fontFamilyBidi":"Times New Roman"},"basedOn":"Heading 3 Char"},{"name":"Style Red","type":"Character","characterFormat":{"fontColor":"#FF0000FF"},"basedOn":"Default Paragraph Font"},{"name":"apple-converted-space","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Subtle Emphasis","type":"Character","characterFormat":{"italic":true,"fontColor":"#404040FF","italicBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Endnote Text","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"contextualSpacing":false},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","link":"Endnote Text Char"},{"name":"Endnote Text Char","type":"Character","characterFormat":{"fontSize":10,"fontFamily":"Arial","fontSizeBidi":10,"fontFamilyBidi":"Times New Roman"},"basedOn":"Default Paragraph Font"},{"name":"Endnote Reference","type":"Character","characterFormat":{"baselineAlignment":"Superscript"},"basedOn":"Default Paragraph Font"},{"name":"Mention","type":"Character","characterFormat":{"fontColor":"#2B579AFF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention","type":"Character","characterFormat":{"fontColor":"#808080FF"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"listId":0},{"abstractListId":1,"listId":1},{"abstractListId":2,"listId":2},{"abstractListId":3,"listId":3},{"abstractListId":5,"listId":5},{"abstractListId":8,"listId":8},{"abstractListId":9,"listId":9},{"abstractListId":13,"listId":13},{"abstractListId":15,"listId":15},{"abstractListId":16,"listId":16},{"abstractListId":17,"listId":17},{"abstractListId":24,"listId":24},{"abstractListId":25,"listId":25},{"abstractListId":27,"listId":27},{"abstractListId":29,"listId":29},{"abstractListId":30,"listId":30}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":1,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontSize":20,"fontFamily":"EYInterstate Light","fontColor":"#7F7E82FF"},"paragraphFormat":{"leftIndent":42.5,"firstLineIndent":-42.5,"listFormat":{},"tabs":[{"position":42.5,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":14,"fontFamily":"EYInterstate Light","fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":42.5,"firstLineIndent":-42.5,"listFormat":{},"tabs":[{"position":42.5,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":12,"fontFamily":"EYInterstate Light","fontColor":"#000000FF","fontSizeBidi":12},"paragraphFormat":{"leftIndent":42.5,"firstLineIndent":-42.5,"listFormat":{},"tabs":[{"position":42.5,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3","restartLevel":2,"startAt":1},{"characterFormat":{"bold":true,"italic":false,"fontSize":11,"fontFamily":"EYInterstate Light","fontColor":"#000000FF"},"paragraphFormat":{"leftIndent":0,"firstLineIndent":-42.5,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]},{"abstractListId":2,"levels":[{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":3,"levels":[{"characterFormat":{"bold":true},"paragraphFormat":{"leftIndent":22.5,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-54,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-90,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","restartLevel":8,"startAt":1}]},{"abstractListId":5,"levels":[{"characterFormat":{"fontSize":10,"fontFamily":"Symbol","baselineAlignment":"Normal","fontColor":"#00000000","fontSizeBidi":10},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":8,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":21.600000381469727,"firstLineIndent":-21.600000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":100.80000305175781,"firstLineIndent":-28.799999237060547,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":61.20000076293945,"firstLineIndent":-43.20000076293945,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":50.400001525878906,"firstLineIndent":-50.400001525878906,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":57.599998474121094,"firstLineIndent":-57.599998474121094,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":64.80000305175781,"firstLineIndent":-64.80000305175781,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":79.19999694824219,"firstLineIndent":-79.19999694824219,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","restartLevel":8,"startAt":1}]},{"abstractListId":9,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":0,"firstLineIndent":-28.350000381469727,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":70.94999694824219,"firstLineIndent":-42.54999923706055,"listFormat":{},"tabs":[{"position":70.94999694824219,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":42.54999923706055,"firstLineIndent":-42.54999923706055,"listFormat":{},"tabs":[{"position":42.54999923706055,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":42.54999923706055,"firstLineIndent":-42.54999923706055,"listFormat":{},"tabs":[{"position":42.54999923706055,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":50.400001525878906,"firstLineIndent":-50.400001525878906,"listFormat":{},"tabs":[{"position":50.400001525878906,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":57.599998474121094,"firstLineIndent":-57.599998474121094,"listFormat":{},"tabs":[{"position":57.599998474121094,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":64.80000305175781,"firstLineIndent":-64.80000305175781,"listFormat":{},"tabs":[{"position":64.80000305175781,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-72,"listFormat":{},"tabs":[{"position":72,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":79.19999694824219,"firstLineIndent":-79.19999694824219,"listFormat":{},"tabs":[{"position":79.19999694824219,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.%2.%3.%4.%5.%6.%7.%8.%9","restartLevel":8,"startAt":1}]},{"abstractListId":13,"levels":[{"characterFormat":{"fontFamily":"Roboto Lt"},"paragraphFormat":{"leftIndent":70,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"-","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":106,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":142,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":178,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":214,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":250,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":286,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":322,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":358,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":15,"levels":[{"characterFormat":{},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%2)","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":99,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%3","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":198,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":234,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":270,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":306,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":16,"levels":[{"characterFormat":{"bold":true,"italic":false,"fontFamily":"Calibri Light","strikethrough":"None","baselineAlignment":"Normal","fontColor":"#808080FF","boldBidi":false,"italicBidi":false},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"Table %1:","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":17,"levels":[{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#FFD200FF","fontSizeBidi":12},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":36,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#FFE600FF","fontSizeBidi":12},"paragraphFormat":{"leftIndent":78.55000305175781,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":78.55000305175781,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#FFE600FF","fontSizeBidi":12},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":108,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#FFE600FF","fontSizeBidi":12},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-36,"listFormat":{},"tabs":[{"position":144,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontColor":"#00000000","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"listFormat":{},"tabs":[{"position":0,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"►","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":0,"listFormat":{}},"followCharacter":"None","listLevelPattern":"None","numberFormat":"","restartLevel":8,"startAt":1}]},{"abstractListId":24,"levels":[{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-36,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":25,"levels":[{"characterFormat":{"fontColor":"#808080FF"},"paragraphFormat":{"leftIndent":155.0500030517578,"firstLineIndent":-10.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"Figure %1:","restartLevel":0,"startAt":1},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":79.9000015258789,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"•","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":115.9000015258789,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":151.89999389648438,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":187.89999389648438,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":223.89999389648438,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":259.8999938964844,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":295.8999938964844,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":331.8999938964844,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":27,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#E2680BFF"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]},{"abstractListId":29,"levels":[{"characterFormat":{"bold":false,"italic":false,"fontSize":10,"strikethrough":"None","baselineAlignment":"Normal","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":10},"paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{"bold":false},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":99,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"UpRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":198,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":234,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":270,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":306,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]},{"abstractListId":30,"levels":[{"characterFormat":{"fontFamily":"Courier New"},"paragraphFormat":{"leftIndent":54,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":90,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":126,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":162,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":198,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":234,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":270,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Courier New","fontFamilyBidi":"Courier New"},"paragraphFormat":{"leftIndent":306,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"o","restartLevel":0,"startAt":0},{"characterFormat":{"fontFamily":"Wingdings"},"paragraphFormat":{"leftIndent":342,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0}]}]};
describe('List tab Width Validation', () => {
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
        editor.open(JSON.stringify(listDocument));
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
    it('List Tab Width', () => {
console.log('List Tab Width');
        expect(Math.round(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBeGreaterThanOrEqual(8);
    });
});
describe('List tab Width first indent Validation', () => {
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
    it('List tab Width first indent Validation', () => {
        editor.openBlank();
        editor.editor.insertText('hello');
        editor.selection.handleTabKey(true, false);
        (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).paragraphFormat.firstLineIndent = 100;
        expect(Math.round(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[1].width)).toBeGreaterThanOrEqual(8);
    });
});