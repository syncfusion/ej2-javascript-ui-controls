import { LayoutViewer } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Search } from '../../src/document-editor/implementation/search/index';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { OptionsPane } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index'

function getJson() {
    let json = {
        "sections": [
            {
                "sectionFormat": {
                    "pageWidth": 612,
                    "pageHeight": 792,
                    "leftMargin": 72,
                    "rightMargin": 72,
                    "topMargin": 72,
                    "bottomMargin": 72,
                    "differentFirstPage": true,
                    "differentOddAndEvenPages": true,
                    "headerDistance": 36,
                    "footerDistance": 36
                },
                "blocks": [
                    {
                        "paragraphFormat": {
                            "styleName": "Normal",
                            "listFormat": {}
                        },
                        "characterFormat": {},
                        "inlines": [
                            {
                                "characterFormat": {},
                                "text": "First "
                            },
                            {
                                "characterFormat": {},
                                "text": "page"
                            },
                            {
                                "characterFormat": {},
                                "text": " body"
                            }
                        ]
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
                        "inlines": [
                            {
                                "characterFormat": {},
                                "text": "Even "
                            },
                            {
                                "characterFormat": {},
                                "text": "page"
                            },
                            {
                                "characterFormat": {},
                                "text": "body"
                            },
                            {
                                "characterFormat": {},
                                "text": " "
                            }
                        ]
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
                        "inlines": [
                            {
                                "characterFormat": {},
                                "text": "Odd page body"
                            }
                        ]
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
                        "inlines": [
                            {
                                "characterFormat": {},
                                "text": "Even page body2"
                            }
                        ]
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
                        "inlines": [
                            {
                                "characterFormat": {},
                                "text": "Odd page body2"
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
                                "inlines": [
                                    {
                                        "characterFormat": {},
                                        "text": "Odd page header"
                                    }
                                ]
                            }
                        ]
                    },
                    "footer": {
                        "blocks": [
                            {
                                "paragraphFormat": {
                                    "styleName": "Footer",
                                    "listFormat": {}
                                },
                                "characterFormat": {},
                                "inlines": [
                                    {
                                        "characterFormat": {},
                                        "text": "Odd page footer"
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
                                "inlines": [
                                    {
                                        "characterFormat": {},
                                        "text": "Even page he"
                                    },
                                    {
                                        "characterFormat": {},
                                        "text": "a"
                                    },
                                    {
                                        "characterFormat": {},
                                        "text": "der"
                                    }
                                ]
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
                                "inlines": [
                                    {
                                        "characterFormat": {},
                                        "text": "even page footer"
                                    }
                                ]
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
                                        "text": "First page"
                                    },
                                    {
                                        "characterFormat": {},
                                        "text": " header"
                                    }
                                ]
                            }
                        ]
                    },
                    "firstPageFooter": {
                        "blocks": [
                            {
                                "paragraphFormat": {
                                    "styleName": "Footer",
                                    "listFormat": {}
                                },
                                "characterFormat": {},
                                "inlines": [
                                    {
                                        "characterFormat": {},
                                        "text": "first page footer"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ],
        "characterFormat": {
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "paragraphFormat": {
            "afterSpacing": 8,
            "lineSpacing": 1.0791666507720947,
            "lineSpacingType": "Multiple",
            "listFormat": {}
        },
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
                "name": "Header",
                "type": "Paragraph",
                "paragraphFormat": {
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "listFormat": {},
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
                "characterFormat": {},
                "basedOn": "Normal",
                "link": "Header Char",
                "next": "Normal"
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
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "listFormat": {},
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
                "characterFormat": {},
                "basedOn": "Normal",
                "link": "Footer Char",
                "next": "Normal"
            },
            {
                "name": "Footer Char",
                "type": "Character",
                "characterFormat": {},
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
                "name": "Heading 2",
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
                    "outlineLevel": "Level2",
                    "listFormat": {}
                },
                "characterFormat": {
                    "fontSize": 13,
                    "fontFamily": "Calibri Light",
                    "fontColor": "#2F5496"
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
    }
    return JSON.stringify(json);
}
/**
 * Search Module public API
 */
describe('Search module testing', () => {
    let editor: DocumentEditor = undefined;
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search, OptionsPane, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true, enableOptionsPane: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('header text testing using search icon', () => {
console.log('header text testing using search icon');
        editor.open(getJson());
        let optionsPane = editor.optionsPaneModule;
        editor.showOptionsPane();
        (optionsPane as any).searchInput.value = 'page';
        optionsPane.searchIconClickInternal();
        expect((optionsPane as any).resultsListBlock.children.length).toBe(11);
    });
    it('click close icon while searching text', () => {
console.log('click close icon while searching text');
        editor.open(getJson());
        let optionsPane = editor.optionsPaneModule;
        editor.showOptionsPane();
        (optionsPane as any).searchInput.value = 'page';
        optionsPane.searchIconClickInternal();
        optionsPane.searchIconClickInternal();
        (optionsPane as any).searchOptionChange();
        expect((optionsPane as any).resultsListBlock.children.length).toBe(0);
    });
    it('searching text does not contain document testing', () => {
console.log('searching text does not contain document testing');
        editor.open(getJson());
        let optionsPane = editor.optionsPaneModule;
        editor.showOptionsPane();
        (optionsPane as any).searchInput.value = 'xyz';
        (optionsPane as any).searchOptionChange();
        expect((optionsPane as any).resultsListBlock.children.length).toBe(0);
    });
    it('header text replace testing validation', () => {
console.log('header text replace testing validation');
        editor.open(getJson());
        let optionsPane = editor.optionsPaneModule;
        editor.showOptionsPane();
        (optionsPane as any).searchInput.value = 'page';
        optionsPane.searchIconClickInternal();
        let replaceelementbox: any = (optionsPane as any).replaceWith;
        replaceelementbox.value = '';
        optionsPane.onReplaceButtonClick();
        optionsPane.onReplaceButtonClick();
        expect((optionsPane as any).resultsListBlock.children.length).toBe(10);
    });
});

describe('Search Public API validation ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true,
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Search result change event validtion', () => {
console.log('Search result change event validtion');
        editor.open(getJson());
        let spy = jasmine.createSpy('searchChange');
        editor.searchResultsChange = spy;
        editor.searchModule.findAll('page');
        expect(spy).toHaveBeenCalled();
        expect(editor.search.searchResults.index).toBe(0);
    });
    it('Search result navigation', () => {
console.log('Search result navigation');
        editor.search.searchResults.index++;
        expect(editor.search.searchResults.index).toBe(1);
        editor.search.searchResults.index--;
        expect(editor.search.searchResults.index).toBe(0);
        editor.search.searchResults.index--;
        expect(editor.search.searchResults.index).toBe(0);
    });
});

describe('Search Public API validation Replace All Validation ', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search);
        editor = new DocumentEditor({
            enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true,
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Replace Operation with out search result', () => {
console.log('Replace Operation with out search result');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        let spy = jasmine.createSpy('searchChange');
        editor.searchResultsChange = spy;
        editor.search.searchResults.replaceAll("Software");
        editor.search.searchResults.replace("Software");
        expect(spy).not.toHaveBeenCalled();
    });
    it('Search result change event validtion', () => {
console.log('Search result change event validtion');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.searchModule.findAll('sft');
        expect(editor.search.searchResults.length).toBe(6);
        let spy = jasmine.createSpy('findOperation');
        editor.searchResultsChange = spy;
        editor.search.searchResults.replaceAll("Software");
        expect(spy).toHaveBeenCalled();
        expect(editor.search.searchResults.length).toBe(0);
    });
    it('Search result change event validtion', () => {
console.log('Search result change event validtion');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.editorModule.insertText('Syncfusion sft pvt ltd');
        editor.searchModule.findAll('sft');
        let spy = jasmine.createSpy('replaceOperation');
        editor.searchResultsChange = spy;
        editor.search.searchResults.replace("Software");
        expect(spy).toHaveBeenCalled();
    });
});

