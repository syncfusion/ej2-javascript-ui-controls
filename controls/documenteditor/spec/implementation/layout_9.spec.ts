import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer, ParagraphWidget, LineWidget, TextElementBox, ListTextElementBox, TableCellWidget, WBorder } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
let headingStylejson = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595,
                "pageHeight": 842,
                "leftMargin": 70.8499984741211,
                "rightMargin": 70.8499984741211,
                "topMargin": 70.8499984741211,
                "bottomMargin": 70.8499984741211,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Heading 2",
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
                            "name": "_Toc511665397"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Hlk500932317"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc499919425"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc514760868"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Toc418831707"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "P"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "u"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "r"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "p"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "o"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "s"
                        },
                        {
                            "characterFormat": {
                            },
                            "text": "e"
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
                            "name": "_Toc511665397"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Hlk500932317"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc499919425"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc514760868"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Toc418831707"
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
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "textAlignment": "Right",
                                "styleName": "Footer",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [{}]
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {
                                },
                                "tabs": [
                                    {
                                        "position": 108.75,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 171,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 177,
                                        "deletePosition": 0,
                                        "tabJustification": "Left",
                                        "tabLeader": "None"
                                    },
                                    {
                                        "position": 453.29998779296875,
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
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "text": "\t"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "imageString": "data:image/jpeg;base64,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",
                                    "width": 27.75,
                                    "height": 29.48032
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Header",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [{}]
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [{}]
                        }
                    ]
                },
                "evenFooter": {
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
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 0,
                                    "fieldCodeType": "FieldPage"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "text": " PAGE   \\* MERGEFORMAT "
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 2
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "text": "64"
                                },
                                {
                                    "characterFormat": {
                                    },
                                    "fieldType": 1
                                }
                            ]
                        },
                        {
                            "paragraphFormat": {
                                "styleName": "Normal",
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
        "fontSize": 12,
        "fontFamily": "Calibri",
        "underline": "None",
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "highlightColor": "NoColor",
        "fontColor": "#000000",
        "fontSizeBidi": 12,
        "fontFamilyBidi": "minorBidi"
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
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
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
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 10
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 18,
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Heading 2"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "fontSizeBidi": 10
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
                "leftIndent": 28.799999237060547,
                "beforeSpacing": 16,
                "afterSpacing": 6,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 1
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Normal",
            "link": "Heading 2 Char",
            "next": "Body"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Body",
            "type": "Paragraph",
            "paragraphFormat": {
                "afterSpacing": 6,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "link": "Body Char"
        },
        {
            "name": "Body Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 10,
                "afterSpacing": 10,
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Normal",
            "link": "Heading 3 Char",
            "next": "Body"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#EB5015FF",
                "boldBidi": true,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 43.20000076293945,
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontColor": "#EB501FFF",
                "italicBidi": true
            },
            "basedOn": "Heading 3",
            "link": "Heading 4 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 11,
                "fontFamily": "Calibri Light",
                "fontColor": "#EB501FFF",
                "boldBidi": true,
                "italicBidi": true,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontFamilyBidi": "majorBidi"
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
                "fontFamily": "Calibri Light",
                "fontColor": "#ED7D31FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level6",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontFamilyBidi": "majorBidi"
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
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level7",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Normal",
            "link": "Heading 7 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763FF",
                "italicBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Normal",
            "link": "Heading 8 Char",
            "next": "Normal"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "outlineLevel": "Level9",
                "listFormat": {
                    "listId": 1,
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
                "italic": true,
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "majorBidi"
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
                "fontSize": 10.5,
                "fontFamily": "Calibri Light",
                "fontColor": "#272727FF",
                "italicBidi": true,
                "fontSizeBidi": 10.5,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Center",
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Footer",
            "link": "Header Char",
            "next": "Normal"
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
                "fontColor": "#7F7F7FFF"
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
                "fontFamily": "Calibri Light",
                "fontColor": "#7F7F7FFF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Header Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#7F7F7FFF",
                "fontSizeBidi": 10
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Footnote Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontColor": "#595959FF"
            },
            "basedOn": "Normal",
            "link": "Footnote Text Char"
        },
        {
            "name": "Footnote Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Calibri Light",
                "fontColor": "#595959FF",
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
            "name": "Normal TM",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "fontFamily": "Arial",
                "fontColor": "#000000FF",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Normal TM Char"
        },
        {
            "name": "Normal TM Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Arial",
                "fontColor": "#000000FF",
                "fontSizeBidi": 11,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Figure Heading",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Center",
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 5
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 9,
                "fontFamily": "Calibri Light",
                "fontColor": "#808080FF",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Bullit List (1)",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 0,
                "firstLineIndent": 0,
                "listFormat": {
                    "listId": 0
                },
                "tabs": [
                    {
                        "position": 18,
                        "deletePosition": 0,
                        "tabJustification": "List",
                        "tabLeader": "None"
                    }
                ]
            },
            "characterFormat": {
                "fontColor": "#00000000",
                "fontSizeBidi": 12
            },
            "basedOn": "Normal TM"
        },
        {
            "name": "TM Header style",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "beforeSpacing": 6,
                "afterSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Arial",
                "fontColor": "#0072BAFF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "TM Header style Char",
            "next": "Normal"
        },
        {
            "name": "TM Header style Char",
            "type": "Character",
            "characterFormat": {
                "italic": true,
                "fontSize": 10,
                "fontFamily": "Arial",
                "fontColor": "#0072BAFF",
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "ING_BodyText_Bold Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 9.5,
                "fontFamily": "Arial"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Bullet List",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 22.700000762939453,
                "firstLineIndent": -14.199999809265137,
                "afterSpacing": 6,
                "lineSpacing": 1.100000023841858,
                "lineSpacingType": "Multiple",
                "listFormat": {
                    "listId": 3
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "fontColor": "#404040FF",
                "fontSizeBidi": 10
            }
        },
        {
            "name": "annotation reference",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontSizeBidi": 9
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "annotation text",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 6,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                },
                "contextualSpacing": false
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Cambria",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Comment Text Char"
        },
        {
            "name": "Comment Text Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Cambria",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Times New Roman",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Balloon Text Char"
        },
        {
            "name": "Balloon Text Char",
            "type": "Character",
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Times New Roman",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Bullit List (2)",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                    "listId": 9
                }
            },
            "characterFormat": {
                "fontColor": "#00000000",
                "fontSizeBidi": 12
            },
            "basedOn": "Normal TM"
        },
        {
            "name": "annotation subject",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 0,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontFamily": "Calibri Light",
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "minorBidi"
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
                "fontFamily": "Calibri Light",
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Comment Text Char"
        },
        {
            "name": "List Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 36,
                "listFormat": {
                }
            },
            "characterFormat": {
            },
            "basedOn": "Normal"
        },
        {
            "name": "TOC Heading",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 24,
                "afterSpacing": 0,
                "lineSpacing": 1.149999976158142,
                "lineSpacingType": "Multiple",
                "outlineLevel": "BodyText",
                "listFormat": {
                    "listId": -1,
                    "listLevelNumber": 0
                }
            },
            "characterFormat": {
                "fontSize": 14,
                "fontColor": "#2F5496FF",
                "boldBidi": true,
                "fontSizeBidi": 14,
                "fontFamilyBidi": "majorBidi"
            },
            "basedOn": "Heading 1",
            "next": "Normal"
        },
        {
            "name": "TOC 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "italic": true,
                "fontSize": 12,
                "fontFamily": "Calibri",
                "boldBidi": true,
                "italicBidi": true,
                "fontSizeBidi": 12,
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 10,
                "beforeSpacing": 6,
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 11,
                "fontFamily": "Calibri",
                "boldBidi": true,
                "fontSizeBidi": 11,
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 20,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0563C1FF"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "TOC 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 30,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 40,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 50,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 60,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 70,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "TOC 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 80,
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri",
                "fontFamilyBidi": "minorHAnsi"
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Normal (Web)",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Times New Roman",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal"
        },
        {
            "name": "NormaalTM Teken",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "minorBidi"
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
            "abstractListId": 1,
            "listId": 1
        },
        {
            "abstractListId": 3,
            "listId": 3
        },
        {
            "abstractListId": 5,
            "listId": 5
        },
        {
            "abstractListId": 9,
            "listId": 9
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                        "fontSize": 10,
                        "fontFamily": "Symbol",
                        "baselineAlignment": "Normal",
                        "fontColor": "#00000000",
                        "fontSizeBidi": 10
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
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
                        "fontFamily": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
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
                        "leftIndent": 108,
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
                        "leftIndent": 144,
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
                        "fontFamily": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180,
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
                        "leftIndent": 216,
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
                        "leftIndent": 252,
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
                        "fontFamily": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 288,
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
                        "leftIndent": 324,
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
            "abstractListId": 1,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 35.75,
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
                    },
                    "paragraphFormat": {
                        "leftIndent": 482.3999938964844,
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
                        "leftIndent": 61.20000076293945,
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
            "abstractListId": 3,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Symbol"
                    },
                    "paragraphFormat": {
                        "leftIndent": 54,
                        "firstLineIndent": -36,
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
                        "leftIndent": 72,
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
                        "leftIndent": 108,
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
                        "leftIndent": 144,
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
                        "leftIndent": 180,
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
                        "leftIndent": 216,
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
                        "leftIndent": 252,
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
                        "leftIndent": 288,
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
                        "leftIndent": 324,
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
            "abstractListId": 5,
            "levels": [
                {
                    "characterFormat": {
                        "fontColor": "#808080FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 155.0500030517578,
                        "firstLineIndent": -10.350000381469727,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "Figure %1:",
                    "restartLevel": 0,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontFamily": "Arial",
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 79.9000015258789,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "•",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 115.9000015258789,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%3.",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 151.89999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 187.89999389648438,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%5.",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 223.89999389648438,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%6.",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 259.8999938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 295.8999938964844,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%8.",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 331.8999938964844,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%9.",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 9,
            "levels": [
                {
                    "characterFormat": {
                        "fontFamily": "Courier New",
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
                    "numberFormat": "o",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontFamily": "Courier New",
                        "fontFamilyBidi": "Courier New"
                    },
                    "paragraphFormat": {
                        "leftIndent": 90,
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
                        "leftIndent": 126,
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
                        "leftIndent": 162,
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
                        "leftIndent": 198,
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
                        "leftIndent": 234,
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
                        "leftIndent": 270,
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
                        "leftIndent": 306,
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
                        "leftIndent": 342,
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
        }
    ]
};
let listParaJson = {
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
                        "styleName": "List Paragraph",
                        "listFormat": {
                            "listId": 2,
                            "listLevelNumber": 0
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
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "minorBidi"
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
    "defaultTabWidth": 36,
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
            },
            "next": "Normal"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 24,
                "firstLineIndent": 0,
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 5
                }
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF",
                "fontSizeBidi": 13,
                "fontFamilyBidi": "majorBidi"
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
                "fontFamilyBidi": "majorBidi"
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
            "name": "List Paragraph",
            "type": "Paragraph",
            "paragraphFormat": {
                "leftIndent": 36,
                "listFormat": {
                },
                "contextualSpacing": true
            },
            "characterFormat": {
            },
            "basedOn": "Normal",
            "next": "List Paragraph"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                }
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [
        {
            "abstractListId": 2,
            "listId": 2
        },
        {
            "abstractListId": 5,
            "listId": 5
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 2,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 68.4000015258789,
                        "firstLineIndent": -20.399999618530273,
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
                        "leftIndent": 102,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%2.",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 138,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%3.",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 174,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 210,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%5.",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 246,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%6.",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 282,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 318,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%8.",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 354,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%9.",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        },
        {
            "abstractListId": 5,
            "levels": [
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 492,
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
                        "leftIndent": 478,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%2.",
                    "restartLevel": 1,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 164,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%3.",
                    "restartLevel": 2,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 200,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%4.",
                    "restartLevel": 3,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 236,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%5.",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 272,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%6.",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 308,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "%7.",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 344,
                        "firstLineIndent": -18,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "%8.",
                    "restartLevel": 7,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                    },
                    "paragraphFormat": {
                        "leftIndent": 380,
                        "firstLineIndent": -9,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "%9.",
                    "restartLevel": 8,
                    "startAt": 1
                }
            ]
        }
    ]
};
let sectionBreak: any = {
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
                    "paragraphFormat": { "listFormat": {} },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {}
        },
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
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
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
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": { "listFormat": {} },
            "characterFormat": {},
            "next": "Normal"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF",
                "fontSizeBidi": 13,
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
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF",
                "fontSizeBidi": 13,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {}
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [],
    "abstractLists": []
};
let sectionBrkJson: any = {
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
                        "styleName": "Heading 2",
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {},
                            "text": "welcome"
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        }
                    ]
                }
            ],
            "headersFooters": {}
        },
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
        "fontColor": "#000000",
        "fontSizeBidi": 11,
        "fontFamilyBidi": "Arial"
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
        "bidi": false
    },
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": { "listFormat": {} },
            "characterFormat": {},
            "next": "Normal"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 2,
                "afterSpacing": 0,
                "outlineLevel": "Level2",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF",
                "fontSizeBidi": 13,
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
                "fontSize": 13,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496FF",
                "fontSizeBidi": 13,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {}
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 16,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {}
            },
            "characterFormat": {
                "italic": true,
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#2F5496"
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
                "fontColor": "#2F5496"
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
                "lineSpacing": 1.0791666507720947,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level6",
                "listFormat": {}
            },
            "characterFormat": {
                "fontFamily": "Calibri Light",
                "fontColor": "#1F3763"
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
                "fontColor": "#1F3763"
            },
            "basedOn": "Default Paragraph Font"
        }
    ],
    "lists": [],
    "abstractLists": []
};
describe('Left indent on heading style validation', () => {
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
        editor.open(JSON.stringify(headingStylejson));
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
    it('Left indent on heading style', () => {
console.log('Left indent on heading style');
        expect(editor.selection.paragraphFormat.leftIndent).toBe(28.799999237060547);
    });
});
describe('Left indent on list para validation', () => {
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
        editor.open(JSON.stringify(listParaJson));
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
    it('Left indent on heading style', () => {
console.log('Left indent on heading style');
        expect(editor.selection.paragraphFormat.leftIndent).toBe(68.4000015258789);
    });
});
describe('Section break para style validation', () => {
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
        editor.open(JSON.stringify(sectionBreak));
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
    it('Section break para style validation 1', () => {
console.log('Section break para style validation 1');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).paragraphFormat.baseStyle.name).toBe('Normal');
    });
    it('Section break para style validation 2', () => {
console.log('Section break para style validation 2');
        editor.open(JSON.stringify(sectionBrkJson));
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
    });
});
