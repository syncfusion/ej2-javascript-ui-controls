import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, SfdtExport, DocumentHelper, ListLevelPattern } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    BodyWidget, ParagraphWidget, TableCellWidget, TableRowWidget, TableWidget, LineWidget,
    Page, TextElementBox, BlockWidget, ListTextElementBox
} from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';
/**
 * List Spec
 */
let json: Object = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "ello",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "W",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Uiuyuiyiu",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Jhghjgjh",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "jhgjh",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "O",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Rld",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Jjjjjjiij",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Hhuu",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Jiji\\",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "GFTFTY",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Uhguygy",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 1,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Huuu",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Uhuhiu",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "Yfytfytfyt",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "rightIndent": 0,
                        "firstLineIndent": -9,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 2,
                            "listId": 3
                        }
                    },
                    "inlines": [
                        {
                            "text": "jhiij",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 2
                        }
                    },
                    "inlines": [
                        {
                            "text": "Hello",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 2
                        }
                    },
                    "inlines": []
                },
                {
                    "characterFormat": {
                        "bold": false,
                        "italic": false,
                        "strikethrough": "None",
                        "baselineAlignment": "Normal",
                        "fontSize": 11,
                        "fontFamily": "Calibri"
                    },
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "rightIndent": 0,
                        "firstLineIndent": -18,
                        "beforeSpacing": 0,
                        "afterSpacing": 8,
                        "lineSpacing": 1.0791666507720947,
                        "lineSpacingType": "Multiple",
                        "textAlignment": "Left",
                        "listFormat": {
                            "listLevelNumber": 0,
                            "listId": 2
                        }
                    },
                    "inlines": [
                        {
                            "text": "Wolrd",
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": "None",
                                "baselineAlignment": "Normal",
                                "fontSize": 11,
                                "fontFamily": "Calibri"
                            }
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36,
                "footerDistance": 36,
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 72,
                "rightMargin": 72,
                "topMargin": 72,
                "bottomMargin": 72,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false
            }
        }
    ],
    "characterFormat": {
        "bold": false,
        "italic": false,
        "strikethrough": "None",
        "baselineAlignment": "Normal",
        "fontSize": 11,
        "fontFamily": "Calibri"
    },
    "lists": [
        {
            "listId": 2,
            "abstractListId": 2
        },
        {
            "listId": 3,
            "abstractListId": 3
        }
    ],
    "abstractLists": [
        {
            "abstractListId": 2,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.",
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 2,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%3.",
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -9
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "firstLineIndent": -9
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "paragraphFormat": {
                        "leftIndent": 288,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "paragraphFormat": {
                        "leftIndent": 324,
                        "firstLineIndent": -9
                    }
                }
            ]
        },
        {
            "abstractListId": 3,
            "levels": [
                {
                    "startAt": 1,
                    "restartLevel": 0,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%1.",
                    "paragraphFormat": {
                        "leftIndent": 36,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%2.",
                    "paragraphFormat": {
                        "leftIndent": 72,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 1,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%3.",
                    "paragraphFormat": {
                        "leftIndent": 108,
                        "firstLineIndent": -9
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 3,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%4.",
                    "paragraphFormat": {
                        "leftIndent": 144,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 4,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%5.",
                    "paragraphFormat": {
                        "leftIndent": 180,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 5,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%6.",
                    "paragraphFormat": {
                        "leftIndent": 216,
                        "firstLineIndent": -9
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 6,
                    "listLevelPattern": "Arabic",
                    "followCharacter": "Tab",
                    "numberFormat": "%7.",
                    "paragraphFormat": {
                        "leftIndent": 252,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 7,
                    "listLevelPattern": "LowLetter",
                    "followCharacter": "Tab",
                    "numberFormat": "%8.",
                    "paragraphFormat": {
                        "leftIndent": 288,
                        "firstLineIndent": -18
                    }
                },
                {
                    "startAt": 1,
                    "restartLevel": 8,
                    "listLevelPattern": "LowRoman",
                    "followCharacter": "Tab",
                    "numberFormat": "%9.",
                    "paragraphFormat": {
                        "leftIndent": 324,
                        "firstLineIndent": -9
                    }
                }
            ]
        }
    ],
    "background": {
        "color": "#FFFFFFFF"
    }
};
//Apply Bullet or Numbering public API Validation
describe('Multi Level List apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Multilevel number brace validation', () => {
console.log('Multilevel number brace validation');
        editor.openBlank();
        editor.editor.applyNumbering('numbering');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(0);
    });
    it('MultiLevel Number dot validation', () => {
console.log('MultiLevel Number dot validation');
        editor.openBlank();
        editor.editor.applyNumbering('multiLevel');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('MultiLevel Bullet List validation', () => {
console.log('MultiLevel Bullet List validation');
        editor.openBlank();
        editor.editor.applyNumbering('bullet');
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(-1);
    });
    it('MultiLevel None validation', () => {
console.log('MultiLevel None validation');
        editor.openBlank();
        editor.selection.paragraphFormat.setList(undefined);
        expect(editor.selection.paragraphFormat.listId).toBe(-1);
    });
});
describe('Numbering apply validation in different scenario', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper.destroy();
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Numbering list arabic', () => {
console.log('Numbering list arabic');
        let id: number = editor.selection.paragraphFormat.listId;
        editor.editor.applyNumbering('%1)', 'Arabic');
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
    });
    it('Numbering list low roman', () => {
console.log('Numbering list low roman');
        let id: number = editor.selection.paragraphFormat.listId;
        editor.editor.applyNumbering('%1.', 'LowRoman');
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
    });
    it('Numbering list up roman', () => {
console.log('Numbering list up roman');
        let id: number = editor.selection.paragraphFormat.listId;
        editor.editor.applyNumbering('%1.', 'UpRoman');
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
    });
});

describe('Bullet list Apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(json));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper.destroy();
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Bullet List validation', () => {
console.log('Bullet List validation');
        let id: number = editor.selection.paragraphFormat.listId;
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        id = editor.selection.paragraphFormat.listId;
        editor.editor.applyBullet('\uf0b7', 'Windings');
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listId).toBe(id);
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listId).not.toBe(id);
    });
    it('Bullet List with selection', () => {
console.log('Bullet List with selection');
        let listId: number = editor.selection.paragraphFormat.listId;
        editor.selection.selectAll();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listId).not.toBe(listId);
    });
});
describe('List Text validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('bullet-Dot', () => {
console.log('bullet-Dot');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        expect(editor.selection.paragraphFormat.listText).toBe('\uf0b7');
    });
    it('bullet-Circle', () => {
console.log('bullet-Circle');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet("\uf06f" + "\u0020", 'Symbol');
        expect(editor.selection.paragraphFormat.listText).toBe("\uf06f" + "\u0020");
    });
    it('bullet-Square', () => {
console.log('bullet-Square');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet('\uf0a7', 'Wingdings')
        expect(editor.selection.paragraphFormat.listText).toBe('\uf0a7');
    });
    it('bullet-Flower', () => {
console.log('bullet-Flower');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet('\uf076', 'Wingdings');
        expect(editor.selection.paragraphFormat.listText).toBe('\uf076');
    });
    it('bullet-Arrow', () => {
console.log('bullet-Arrow');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet('\uf0d8', 'Wingdings');
        expect(editor.selection.paragraphFormat.listText).toBe('\uf0d8');
    });
    it('bullet-Tick', () => {
console.log('bullet-Tick');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyBullet('\uf0fc', 'Wingdings');
        expect(editor.selection.paragraphFormat.listText).toBe('\uf0fc');
    });
    it('numbered-NumberDot', () => {
console.log('numbered-NumberDot');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('numbered-NumberBrace', () => {
console.log('numbered-NumberBrace');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1)', 'Arabic');
        expect(editor.selection.paragraphFormat.listText).toBe('1)');
    });
    it('numbered-UpRoman', () => {
console.log('numbered-UpRoman');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1.', 'UpRoman');
        expect(editor.selection.paragraphFormat.listText).toBe('I.');
    });
    it('numbered-UpLetter', () => {
console.log('numbered-UpLetter');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1.', 'UpLetter');
        expect(editor.selection.paragraphFormat.listText).toBe('A.');
    });
    it('numbered-LowLetterBrace', () => {
console.log('numbered-LowLetterBrace');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1)', 'LowLetter');
        expect(editor.selection.paragraphFormat.listText).toBe('a)');
    });
    it('numbered-LowLetterDot', () => {
console.log('numbered-LowLetterDot');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1.', 'LowLetter');
        expect(editor.selection.paragraphFormat.listText).toBe('a.');
    });
    it('numbered-LowRoman', () => {
console.log('numbered-LowRoman');
        editor.openBlank();
        editor.editorModule.insertText('one');
        editor.editor.applyNumbering('%1.', 'LowRoman');
        expect(editor.selection.paragraphFormat.listText).toBe('i.');
    });
});
describe('List Edit operation validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('List Edit Validation', () => {
console.log('List Edit Validation');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(6);
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    });
    it('Insert Table At List start Validation', () => {
console.log('Insert Table At List start Validation');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        let paragraph = editor.selection.start.paragraph;
        editor.editorModule.insertTable(2, 2);
        expect(((paragraph.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((5) + '.');
        editor.editorHistory.undo();
        expect(((paragraph.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((1) + '.');
    });
    it('Insert Table At List End Validation', () => {
console.log('Insert Table At List End Validation');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleEndKey();
        editor.editorModule.insertTable(2, 2);
        let paragraph = editor.documentHelper.pages[0].bodyWidgets[0].firstChild as BlockWidget;
        expect(((paragraph.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((1) + '.');
        expect(((editor.selection.start.paragraph.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((2) + '.')
    });
    it('Insert Table At List Middle  Validation', () => {
console.log('Insert Table At List Middle  Validation');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        editor.selection.handleRightKey();
        let paragraph = editor.selection.start.paragraph;
        editor.editorModule.insertTable(2, 2);
        let lastBlock: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].lastChild as BlockWidget;
        expect(((lastBlock.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((6) + '.');
        editor.editorModule.insertText('S');
        expect(((lastBlock.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((6) + '.');
    });
});

describe('List paste issue', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, SfdtExport, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = "";
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Paste copied List content', () => {
console.log('Paste copied List content');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.enableLocalPaste = true;
        editor.selection.selectAll();
        editor.selection.copy();
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.editorModule.paste();
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    });
    it('Undo after paste', () => {
console.log('Undo after paste');
        editor.editorHistory.undo();
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    });
    it('Redo after paste', () => {
console.log('Redo after paste');
        editor.editorHistory.redo();
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    });
    it('Undo redo multiple times with redo as last operation', () => {
console.log('Undo redo multiple times with redo as last operation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    });
    it('Undo redo multiple times with undo as last operation', () => {
console.log('Undo redo multiple times with undo as last operation');
        let i: number = 1;
        while (i <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        for (let i: number = 0; i < editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length; i++) {
            let block: BlockWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[i] as BlockWidget;
            expect(((block.firstChild as LineWidget).children[0] as ListTextElementBox).text).toBe((i + 1) + '.');
        }
    })
})
describe('List paste Mutiple Page then Undo and redo operation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, SfdtExport, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = "";
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Paste copied List content', () => {
console.log('Paste copied List content');
        editor.documentHelper.onDocumentChanged([createListDocument()]);
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('A');
        editor.enableLocalPaste = true;
        editor.selection.selectAll();
        editor.selection.copy();
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let i: number = 0;
        while (i <= 30) {
            editor.editorModule.paste();
            i++;
        }
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Undo after paste', () => {
console.log('Undo after paste');
        let i: number = 0;
        while (i <= 30) {
            editor.editorHistory.undo();
            i++;
        }
        expect(editor.documentHelper.pages.length).toBe(1);
    });
    it('Redo after paste', () => {
console.log('Redo after paste');
        let i: number = 0;
        while (i <= 30) {
            editor.editorHistory.redo();
            i++;
        }
        expect(editor.documentHelper.pages.length).toBe(2);
    });
})

function createListDocument(): BodyWidget {
    let section: BodyWidget = new BodyWidget();
    section.index = 0;
    section.sectionFormat = new WSectionFormat(section);
    let paragraph: ParagraphWidget = new ParagraphWidget();
    paragraph.index = 0;
    paragraph.paragraphFormat = new WParagraphFormat(paragraph);
    paragraph.characterFormat = new WCharacterFormat(paragraph);
    let line: LineWidget = new LineWidget(paragraph);
    let element: TextElementBox = new TextElementBox();
    element.text = 'Adventure Works Cycles';
    line.children.push(element);
    element.line = line;
    section.childWidgets.push(paragraph);
    paragraph.containerWidget = section;
    paragraph.childWidgets.push(line);
    return section;
}


describe('Numbering list apply validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, SfdtExport, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = "";
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Arabic numbering validation', () => {
console.log('Arabic numbering validation');
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.documentHelper.lists.length).toBe(2);
    });
    it('Uproman numbering validation', () => {
console.log('Uproman numbering validation');
        editor.editor.applyNumbering('%1.', 'UpRoman');
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.documentHelper.lists.length).toBe(4);
    });
});


describe('List apply validation for level number is greater than 1', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, SfdtExport, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = "";
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Upletter with different number format validation', () => {
console.log('Upletter with different number format validation');
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Arabic');
        editor.editor.applyNumbering('%1)', 'UpLetter');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(1);
    });
    it('Upletter with same number format validation', () => {
console.log('Upletter with same number format validation');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'UpRoman');
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Arabic');
        editor.editor.applyNumbering('%1.', 'Arabic');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(1);
    });
    it('Increase list level validation Numbering', () => {
console.log('Increase list level validation Numbering');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        editor.editor.insertText('Arabic');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Lowletter');
        let pattern: ListLevelPattern = editor.documentHelper.layout.getListLevelPattern(1);
        expect(pattern).toBe('LowLetter');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(1);
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('LowRoman');
        let patternn: ListLevelPattern = editor.documentHelper.layout.getListLevelPattern(2);
        expect(patternn).toBe('LowRoman');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(2);
    });
    it('Increase list level validation Bullets', () => {
console.log('Increase list level validation Bullets');
        editor.openBlank();
        editor.editor.applyBullet('\uf0b7', 'Symbol');
        editor.editor.insertText('dot');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('circle');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(1);
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('square');
        expect(editor.selection.paragraphFormat.listLevelNumber).toBe(2);
    });
});
