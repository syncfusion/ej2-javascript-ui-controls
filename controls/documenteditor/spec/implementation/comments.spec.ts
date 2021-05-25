import { createElement } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { DocumentHelper, Editor, EditorHistory, SfdtExport, WordExport } from '../../src/index';
import { Selection } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
/**
 * Comments Spec
 */
let sfdtFileWithComments: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 21.299999237060547,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 35.400001525878906,
                "footerDistance": 35.400001525878906,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "beforeSpacing": 0.10000000149011612,
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "contextualSpacing": true
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 0,
                            "name": "_Hlk49335887"
                        },
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "boldBidi": true,
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "    "
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "beforeSpacing": 0.10000000149011612,
                        "lineSpacing": 1.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "contextualSpacing": true
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "boldBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "beforeSpacing": 0.10000000149011612,
                        "lineSpacing": 1.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "contextualSpacing": true
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Hlk49335887"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "beforeSpacing": 0.10000000149011612,
                        "lineSpacing": 1.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        },
                        "contextualSpacing": true
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "boldBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "boldBidi": true,
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial",
                                "allCaps": true
                            },
                            "text": "INTRODUCTION"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TESTESauthorising"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " TEST "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TESTE"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "italic": true,
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "italicBidi": true,
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " TEST"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        },
                        "tabs": [
                            {
                                "position": 36,
                                "deletePosition": 0,
                                "tabJustification": "List",
                                "tabLeader": "None"
                            }
                        ]
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "boldBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial",
                        "allCaps": true
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontColor": "#FF0000FF",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "italic": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "italicBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "italic": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "italicBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "italic": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "italicBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "rightIndent": 4.199999809265137,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "boldBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 35.45000076293945,
                        "rightIndent": 4.199999809265137,
                        "firstLineIndent": -35.45000076293945,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                            "listId": 0,
                            "listLevelNumber": 0
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "First "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Line "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "First "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "P"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "a"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "ge"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Line"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                            },
                            "commentCharacterType": 0,
                            "commentId": "s8gkwzobkn9t1i78y5stm"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "First "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Line "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Second "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Page"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "eeeeeeeeeeeeeeee"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTETTESTESTE"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "L"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Second"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " Line "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Second "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "Page"
                        },
                        {
                            "characterFormat": {
                            },
                            "commentCharacterType": 1,
                            "commentId": "s8gkwzobkn9t1i78y5stm"
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": " "
                        },
                        {
                            "characterFormat": {
                                "fontSize": 11,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 11,
                                "fontFamilyBidi": "Arial"
                            },
                            "text": "TTESTESTE"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "leftIndent": 36.849998474121094,
                        "firstLineIndent": -36.849998474121094,
                        "textAlignment": "Justify",
                        "lineSpacing": 2,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "outlineLevel": "Level1",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "bold": true,
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "boldBidi": true,
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                },
                {
                    "paragraphFormat": {
                        "textAlignment": "Justify",
                        "lineSpacing": 1.5,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal",
                        "listFormat": {
                        }
                    },
                    "characterFormat": {
                        "fontSize": 11,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 11,
                        "fontFamilyBidi": "Arial"
                    },
                    "inlines": [
                    ]
                }
            ],
            "headersFooters": {
                "header": {
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
                            ]
                        }
                    ]
                },
                "footer": {
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
                            ]
                        }
                    ]
                },
                "evenHeader": {
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
                            ]
                        }
                    ]
                },
                "evenFooter": {
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
                            ]
                        }
                    ]
                },
                "firstPageHeader": {
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
                            ]
                        }
                    ]
                },
                "firstPageFooter": {
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
                            ]
                        }
                    ]
                }
            }
        },
        {
            "sectionFormat": {
                "pageWidth": 595.2999877929688,
                "pageHeight": 841.9000244140625,
                "leftMargin": 50,
                "rightMargin": 20,
                "topMargin": 20,
                "bottomMargin": 20,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 36,
                "footerDistance": 36,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal_15219c4a-25cd-457b-9133-855345438d1a",
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
                            "name": "_Hlk45789752"
                        },
                        {
                            "characterFormat": {
                            },
                            "bookmarkType": 1,
                            "name": "_Hlk45789752"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
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
                            ]
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "FooterStyle",
                                "listFormat": {
                                }
                            },
                            "characterFormat": {
                            },
                            "inlines": [
                                {
                                    "characterFormat": {
                                    },
                                    "text": "P6"
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
        "fontColor": "#000000FF",
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
        "listFormat": {
        },
        "bidi": false
    },
    "defaultTabWidth": 36,
    "trackChanges": true,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "dontUseHTMLParagraphAutoSpacing": false,
    "formFieldShading": true,
    "styles": [
        {
            "name": "Normal",
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
                "fontFamily": "Times New Roman",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {
                    "listId": 0
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Heading 1"
        },
        {
            "name": "Heading 2",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level2",
                "listFormat": {
                    "listId": 0,
                    "listLevelNumber": 1
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Heading 2"
        },
        {
            "name": "Heading 3",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level3",
                "listFormat": {
                    "listId": 0,
                    "listLevelNumber": 2
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Heading 3"
        },
        {
            "name": "Heading 4",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level4",
                "listFormat": {
                    "listId": 0,
                    "listLevelNumber": 3
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Heading 4"
        },
        {
            "name": "Heading 5",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Justify",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level5",
                "listFormat": {
                    "listId": 0,
                    "listLevelNumber": 4
                }
            },
            "characterFormat": {
                "fontSize": 11,
                "fontSizeBidi": 11
            },
            "basedOn": "Normal",
            "next": "Heading 5"
        },
        {
            "name": "Heading 6",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "Level6",
                "listFormat": {
                    "listLevelNumber": 5
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 5",
            "next": "Heading 6"
        },
        {
            "name": "Heading 7",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "Level7",
                "listFormat": {
                    "listLevelNumber": 6
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 6",
            "next": "Heading 7"
        },
        {
            "name": "Heading 8",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Center",
                "afterSpacing": 12,
                "lineSpacing": 1.5,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level8",
                "listFormat": {
                    "listId": 0,
                    "listLevelNumber": 7
                }
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 11,
                "boldBidi": true,
                "fontSizeBidi": 11,
                "allCaps": true
            },
            "basedOn": "Normal",
            "next": "Normal"
        },
        {
            "name": "Heading 9",
            "type": "Paragraph",
            "paragraphFormat": {
                "outlineLevel": "Level9",
                "listFormat": {
                    "listLevelNumber": 8
                }
            },
            "characterFormat": {
            },
            "basedOn": "Heading 8",
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
            }
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 2 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 3 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 4 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 5 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 6 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 7 Char",
            "type": "Character",
            "characterFormat": {
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 8 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "boldBidi": true,
                "fontFamilyBidi": "Times New Roman",
                "allCaps": true
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Heading 9 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontFamily": "Times New Roman",
                "fontColor": "#000000FF",
                "boldBidi": true,
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
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontColor": "#00000000"
            },
            "basedOn": "Normal",
            "next": "Normal (Web)"
        },
        {
            "name": "Normal_15219c4a-25cd-457b-9133-855345438d1a",
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
                "fontFamily": "Times New Roman",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "next": "Normal_15219c4a-25cd-457b-9133-855345438d1a"
        },
        {
            "name": "FooterStyle",
            "type": "Paragraph",
            "paragraphFormat": {
                "textAlignment": "Right",
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 16,
                "fontColor": "#FF0000FF",
                "fontSizeBidi": 16
            },
            "basedOn": "Normal_15219c4a-25cd-457b-9133-855345438d1a",
            "next": "FooterStyle"
        },
        {
            "name": "Default Paragraph Font_7529d93c-8332-4a68-913b-9a301cc1a275",
            "type": "Character",
            "characterFormat": {
            },
            "basedOn": "Default Paragraph Font"
        },
        {
            "name": "Placeholder Text1",
            "type": "Character",
            "characterFormat": {
                "fontColor": "#808080FF"
            },
            "basedOn": "Default Paragraph Font_7529d93c-8332-4a68-913b-9a301cc1a275"
        },
        {
            "name": "Comment Reference1",
            "type": "Character",
            "characterFormat": {
                "fontSize": 8,
                "fontSizeBidi": 8
            },
            "basedOn": "Default Paragraph Font_7529d93c-8332-4a68-913b-9a301cc1a275"
        },
        {
            "name": "Comment Text1",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 10,
                "fontSizeBidi": 10
            },
            "basedOn": "Normal_15219c4a-25cd-457b-9133-855345438d1a",
            "link": "Comment Text Char",
            "next": "Comment Text1"
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
            "basedOn": "Default Paragraph Font_7529d93c-8332-4a68-913b-9a301cc1a275"
        },
        {
            "name": "Comment Subject1",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "bold": true,
                "boldBidi": true
            },
            "basedOn": "Comment Text1",
            "link": "Comment Subject Char",
            "next": "Comment Text1"
        },
        {
            "name": "Comment Subject Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 10,
                "fontFamily": "Times New Roman",
                "boldBidi": true,
                "fontSizeBidi": 10,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Comment Text Char"
        },
        {
            "name": "Balloon Text",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {
                }
            },
            "characterFormat": {
                "fontSize": 9,
                "fontFamily": "Segoe UI",
                "fontSizeBidi": 9,
                "fontFamilyBidi": "Segoe UI"
            },
            "basedOn": "Normal_15219c4a-25cd-457b-9133-855345438d1a",
            "link": "Balloon Text Char",
            "next": "Balloon Text"
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
            "basedOn": "Default Paragraph Font_7529d93c-8332-4a68-913b-9a301cc1a275"
        }
    ],
    "lists": [
        {
            "abstractListId": 0,
            "levelOverrides": [
            ],
            "listId": 0
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 0,
            "levels": [
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "fontFamily": "Arial",
                        "fontColor": "#000000FF",
                        "boldBidi": false,
                        "italicBidi": false,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36.849998474121094,
                        "firstLineIndent": -36.849998474121094,
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
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -36.849998474121094,
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
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -36.849998474121094,
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
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -36.849998474121094,
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
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "firstLineIndent": -36.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowLetter",
                    "numberFormat": "(%5)",
                    "restartLevel": 4,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "firstLineIndent": -36.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "LowRoman",
                    "numberFormat": "(%6)",
                    "restartLevel": 5,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "firstLineIndent": -36.849998474121094,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "Tab",
                    "listLevelPattern": "Arabic",
                    "numberFormat": "(%7)",
                    "restartLevel": 6,
                    "startAt": 1
                },
                {
                    "characterFormat": {
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "None",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                },
                {
                    "characterFormat": {
                        "fontColor": "#000000FF"
                    },
                    "paragraphFormat": {
                        "firstLineIndent": -36,
                        "listFormat": {
                        }
                    },
                    "followCharacter": "None",
                    "listLevelPattern": "Bullet",
                    "numberFormat": "",
                    "restartLevel": 0,
                    "startAt": 0
                }
            ]
        }
    ],
    "comments": [
        {
            "commentId": "s8gkwzobkn9t1i78y5stm",
            "author": "Guest user",
            "date": "2021-03-30T09:03:15.932Z",
            "blocks": [
                {
                    "inlines": [
                        {
                            "text": "c1"
                        }
                    ]
                }
            ],
            "done": false,
            "replyComments": [
            ]
        }
    ],
    "revisions": [
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:42:00Z",
            "revisionType": null,
            "revisionId": "3004b8d2-891b-4149-bd0e-2132f415d3ce"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:42:00Z",
            "revisionType": null,
            "revisionId": "fb7f21b4-5eb4-458d-87ed-e183d771a230"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "2c0eb568-19a7-4eb4-aed9-a10453693738"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "9af6e506-83bb-4027-824d-9a430873ebcd"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "0b58e938-f39a-4a91-96e7-45d03f8cb736"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "84519b2e-a81d-40f9-94dc-b670412ce234"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "69a37493-f4e4-4734-a78f-6f8075e6afc2"
        },
        {
            "author": "Kalaiselvan Tamilvanan",
            "date": "2021-03-29T12:43:00Z",
            "revisionType": null,
            "revisionId": "2b91fa39-775e-4584-b211-ece77f7778b8"
        }
    ],
    "customXml": [
    ],
    "footnotes": {
        "separator": [
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ]
    },
    "endnotes": {
        "separator": [
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
                        "text": "\u0003"
                    }
                ]
            }
        ],
        "continuationSeparator": [
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
                        "text": "\u0004"
                    }
                ]
            }
        ]
    }
};
describe('Comments Validation', () => {
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
    it('Loading a document with comments added across multiple pages', () => {
        console.log('Loading a document with comments added across multiple pages');
        expect(() => { editor.open(JSON.stringify(sfdtFileWithComments)); }).not.toThrowError();
    });
});
describe('Comments delete comment pane validation', () => {
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
    it('Comments delete comment pane validation', () => {
        editor.openBlank();
        editor.editor.insertText('comment');
        editor.selection.selectAll();
        editor.editor.insertComment('check');
        editor.selection.selectAll();
        editor.editor.delete();
        expect(editor.commentReviewPane.commentPane.comments.length).toBe(0);
        expect(editor.documentHelper.comments.length).toBe(0);
    });
});