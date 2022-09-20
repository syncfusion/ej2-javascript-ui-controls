import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Selection, DocumentHelper, ShapeElementBox, ImageResizer } from '../../src/index';
import {
    SelectionWidgetInfo, TextPosition
} from '../../src/index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { FieldInfo, Point, ShapeInfo } from '../../src/document-editor/implementation/editor/editor-helper';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { BodyWidget, ParagraphWidget, LineWidget, FieldElementBox, TableWidget, TableRowWidget, TableCellWidget, ElementBox, TextElementBox, ImageElementBox } from '../../src/index';
import { WSectionFormat, WCharacterFormat, WParagraphFormat } from '../../src/document-editor/implementation/format/index';

/**
 * Selection Module Test Script
 */
/* eslint-disable */

function selection_document() {
    let selection_document_: object = {
        "sections": [
            {
                "blocks": [
                    {
                        "paragraphFormat": {
                            "leftIndent": 7.199999809265137,
                            "beforeSpacing": 1,
                            "lineSpacing": 3,
                            "lineSpacingType": "Multiple",
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "text": "Syncfus",
                                "characterFormat": {
                                    "highlightColor": "Yellow"
                                }
                            },
                            {
                                "text": "io",
                                "characterFormat": {
                                    "italic": true,
                                    "highlightColor": "Yellow"
                                }
                            },
                            {
                                "text": "n "
                            },
                            {
                                "text": "Software ",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "BrightGreen"
                                }
                            },
                            {
                                "text": "pvt",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "Turquoise"
                                }
                            },
                            {
                                "text": " ltd",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "Turquoise"
                                }
                            },
                            {
                                "text": " "
                            }
                        ]
                    },
                    {
                        "characterFormat": {
                            "styleName": "Hyperlink"
                        },
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": "HYPERLINK \"https://syncfusion.com/\" "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "Document Edito",
                                "characterFormat": {
                                    "highlightColor": "Pink",
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "r",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "fieldType": 1
                            },
                            {
                                "text": " "
                            },
                            {
                                "text": "S",
                                "characterFormat": {
                                    "bold": true
                                }
                            },
                            {
                                "text": "election",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "Blue"
                                }
                            },
                            {
                                "text": " ",
                                "characterFormat": {
                                    "bold": true
                                }
                            },
                            {
                                "text": "testing   D",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "Red"
                                }
                            },
                            {
                                "text": "o",
                                "characterFormat": {
                                    "bold": true
                                }
                            },
                            {
                                "text": "cument",
                                "characterFormat": {
                                    "bold": true,
                                    "highlightColor": "DarkBlue"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "text": "Editor ",
                                "characterFormat": {
                                    "highlightColor": "Teal"
                                }
                            },
                            {
                                "text": "S",
                                "characterFormat": {
                                    "highlightColor": "Teal"
                                }
                            },
                            {
                                "text": "el"
                            },
                            {
                                "text": "ecion",
                                "characterFormat": {
                                    "highlightColor": "Green"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "text": "Te"
                            },
                            {
                                "text": "ting",
                                "characterFormat": {
                                    "highlightColor": "Violet"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "text": "D"
                            },
                            {
                                "text": "ocument",
                                "characterFormat": {
                                    "highlightColor": "DarkRed"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "text": "Editor",
                                "characterFormat": {
                                    "highlightColor": "Gray50"
                                }
                            },
                            {
                                "text": " Se"
                            },
                            {
                                "text": "lection",
                                "characterFormat": {
                                    "highlightColor": "Gray50"
                                }
                            },
                            {
                                "text": " "
                            },
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": " HYPERLINK \"https://syncfusion.com/\" "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "text": "testing",
                                "characterFormat": {
                                    "highlightColor": "Gray25",
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": " ",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "text": "Document",
                                "characterFormat": {
                                    "highlightColor": "Black",
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": " ",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "Editor",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": " S",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "electio",
                                "characterFormat": {
                                    "baselineAlignment": "Subscript",
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "n t",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "estin",
                                "characterFormat": {
                                    "baselineAlignment": "Superscript",
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "text": "g",
                                "characterFormat": {
                                    "styleName": "Hyperlink"
                                }
                            },
                            {
                                "fieldType": 1
                            },
                            {
                                "text": " "
                            }
                        ]
                    },
                    {
                        "rows": [
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "rows": [
                                                    {
                                                        "rowFormat": {
                                                            "allowBreakAcrossPages": true,
                                                            "isHeader": false,
                                                            "height": 0,
                                                            "heightType": "AtLeast",
                                                            "borders": {
                                                                "left": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "right": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "top": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "bottom": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "vertical": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "horizontal": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalDown": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalUp": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                }
                                                            }
                                                        },
                                                        "gridBeforeWidth": 0,
                                                        "gridAfterWidth": 0,
                                                        "gridBefore": 0,
                                                        "gridAfter": 0,
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "name": "_GoBack",
                                                                                "bookmarkType": 0
                                                                            },
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            },
                                                                            {
                                                                                "name": "_GoBack",
                                                                                "bookmarkType": 1
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "rowFormat": {
                                                            "allowBreakAcrossPages": true,
                                                            "isHeader": false,
                                                            "height": 0,
                                                            "heightType": "AtLeast",
                                                            "borders": {
                                                                "left": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "right": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "top": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "bottom": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "vertical": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "horizontal": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalDown": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalUp": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                }
                                                            }
                                                        },
                                                        "gridBeforeWidth": 0,
                                                        "gridAfterWidth": 0,
                                                        "gridBefore": 0,
                                                        "gridAfter": 0,
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "title": null,
                                                "description": null,
                                                "tableFormat": {
                                                    "allowAutoFit": true,
                                                    "leftIndent": 0,
                                                    "tableAlignment": "Left",
                                                    "preferredWidthType": "Auto",
                                                    "borders": {
                                                        "left": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "right": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "top": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "bottom": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "vertical": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "horizontal": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "diagonalDown": {
                                                            "lineStyle": "None",
                                                            "lineWidth": 0,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "diagonalUp": {
                                                            "lineStyle": "None",
                                                            "lineWidth": 0,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            }
                        ],
                        "title": null,
                        "description": null,
                        "tableFormat": {
                            "allowAutoFit": true,
                            "leftIndent": 0,
                            "tableAlignment": "Left",
                            "preferredWidthType": "Auto",
                            "borders": {
                                "left": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "right": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "top": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "bottom": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "vertical": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "horizontal": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalDown": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalUp": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                }
                            }
                        }
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": []
                    },
                    {
                        "rows": [
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "hasFieldEnd": true,
                                                        "fieldType": 0
                                                    },
                                                    {
                                                        "text": "HYPERLINK \"https://syncfusion.com/\" "
                                                    },
                                                    {
                                                        "fieldType": 2
                                                    },
                                                    {
                                                        "text": "Document Editor Selection",
                                                        "characterFormat": {
                                                            "styleName": "Hyperlink"
                                                        }
                                                    },
                                                    {
                                                        "fieldType": 1
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": [
                                                    {
                                                        "text": "Document Editor Selection"
                                                    }
                                                ]
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "rows": [
                                                    {
                                                        "rowFormat": {
                                                            "allowBreakAcrossPages": true,
                                                            "isHeader": false,
                                                            "height": 0,
                                                            "heightType": "AtLeast",
                                                            "borders": {
                                                                "left": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "right": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "top": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "bottom": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "vertical": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "horizontal": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalDown": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalUp": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                }
                                                            }
                                                        },
                                                        "gridBeforeWidth": 0,
                                                        "gridAfterWidth": 0,
                                                        "gridBefore": 0,
                                                        "gridAfter": 0,
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "rowFormat": {
                                                            "allowBreakAcrossPages": true,
                                                            "isHeader": false,
                                                            "height": 0,
                                                            "heightType": "AtLeast",
                                                            "borders": {
                                                                "left": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "right": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "top": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "bottom": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "vertical": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "horizontal": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalDown": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                },
                                                                "diagonalUp": {
                                                                    "lineStyle": "None",
                                                                    "lineWidth": 0,
                                                                    "shadow": false,
                                                                    "space": 0,
                                                                    "hasNoneStyle": false
                                                                }
                                                            }
                                                        },
                                                        "gridBeforeWidth": 0,
                                                        "gridAfterWidth": 0,
                                                        "gridBefore": 0,
                                                        "gridAfter": 0,
                                                        "cells": [
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            },
                                                            {
                                                                "blocks": [
                                                                    {
                                                                        "paragraphFormat": {
                                                                            "styleName": "Normal"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Document Editor Selection"
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 74.1500015258789,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 74.1500015258789,
                                                                    "preferredWidthType": "Point",
                                                                    "verticalAlignment": "Top",
                                                                    "isSamePaddingAsTable": true,
                                                                    "borders": {
                                                                        "left": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "right": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "top": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "bottom": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "vertical": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "horizontal": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalDown": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        },
                                                                        "diagonalUp": {
                                                                            "lineStyle": "None",
                                                                            "lineWidth": 0,
                                                                            "shadow": false,
                                                                            "space": 0,
                                                                            "hasNoneStyle": false
                                                                        }
                                                                    }
                                                                },
                                                                "columnIndex": 0
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "title": null,
                                                "description": null,
                                                "tableFormat": {
                                                    "allowAutoFit": true,
                                                    "leftIndent": 0,
                                                    "tableAlignment": "Left",
                                                    "preferredWidthType": "Auto",
                                                    "borders": {
                                                        "left": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "right": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "top": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "bottom": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "vertical": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "horizontal": {
                                                            "lineStyle": "Single",
                                                            "lineWidth": 0.5,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "diagonalDown": {
                                                            "lineStyle": "None",
                                                            "lineWidth": 0,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        },
                                                        "diagonalUp": {
                                                            "lineStyle": "None",
                                                            "lineWidth": 0,
                                                            "shadow": false,
                                                            "space": 0,
                                                            "hasNoneStyle": false
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "paragraphFormat": {
                                                    "styleName": "Normal"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            }
                        ],
                        "title": null,
                        "description": null,
                        "tableFormat": {
                            "allowAutoFit": true,
                            "leftIndent": 0,
                            "tableAlignment": "Left",
                            "preferredWidthType": "Auto",
                            "borders": {
                                "left": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "right": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "top": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "bottom": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "vertical": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "horizontal": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalDown": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalUp": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                }
                            }
                        }
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "hasFieldEnd": true,
                                "fieldType": 0
                            },
                            {
                                "text": "HYPERLINK \"https://syncfusion.com\" "
                            },
                            {
                                "fieldType": 2
                            },
                            {
                                "imageString": "data:image/png;base64,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",
                                "length": 1,
                                "width": 214,
                                "height": 84,
                                "isInlineImage": true,
                                "isMetaFile": false
                            },
                            {
                                "fieldType": 1
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": [
                            {
                                "imageString": "data:image/png;base64,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",
                                "length": 1,
                                "width": 214,
                                "height": 84,
                                "isInlineImage": true,
                                "isMetaFile": false
                            }
                        ]
                    },
                    {
                        "paragraphFormat": {
                            "styleName": "Normal"
                        },
                        "inlines": []
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
            "fontSize": 11,
            "fontFamily": "Calibri"
        },
        "paragraphFormat": {
            "afterSpacing": 8,
            "lineSpacing": 1.0791666507720947,
            "lineSpacingType": "Multiple"
        },
        "background": {
            "color": "#FFFFFFFF"
        },
        "styles": [
            {
                "type": "Paragraph",
                "name": "Normal",
                "next": "Normal"
            },
            {
                "type": "Character",
                "name": "Default Paragraph Font"
            },
            {
                "type": "Character",
                "name": "Hyperlink",
                "basedOn": "Default Paragraph Font",
                "characterFormat": {
                    "underline": "Single",
                    "fontColor": "#FF0563C1"
                }
            },
            {
                "type": "Character",
                "name": "Unresolved Mention",
                "basedOn": "Default Paragraph Font",
                "characterFormat": {
                    "fontColor": "#FF808080"
                }
            }
        ]
    };
    return JSON.stringify(selection_document_);
}

/**
 * field Module Test Script
 */
/* field sfdt*/
let field_document: any = {
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
                    "inlines": [
                        {
                            "characterFormat": {},
                            "fieldType": 0,
                            "hasFieldEnd": true
                        },
                        {
                            "characterFormat": {},
                            "text": " IF "
                        },
                        {
                            "characterFormat": {},
                            "text": "\""
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 0,
                            "hasFieldEnd": true
                        },
                        {
                            "characterFormat": {},
                            "text": " MERGEFIELD  \"Merge Field1\" \\* Upper  \\* MERGEFORMAT "
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {},
                            "text": "«MERGE FIELD1»"
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 1
                        }
                    ]
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
                            "text": "Paragraph 1"
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
                                                "styleName": "Normal",
                                                "listFormat": {}
                                            },
                                            "characterFormat": {},
                                            "inlines": [
                                                {
                                                    "characterFormat": {},
                                                    "text": "Table"
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
                                        "preferredWidth": 467.5,
                                        "preferredWidthType": "Point",
                                        "cellWidth": 467.5,
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
                        467.5
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
                    "columnCount": 1
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
                            "text": "Paragraph 2"
                        },
                        {
                            "characterFormat": {},
                            "text": " \""
                        },
                        {
                            "characterFormat": {},
                            "text": " "
                        },
                        {
                            "characterFormat": {},
                            "text": "> 0 true false \\* MERGEFORMAT "
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {},
                            "text": "false"
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 1
                        }
                    ]
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
                            "fieldType": 0,
                            "hasFieldEnd": true
                        },
                        {
                            "characterFormat": {},
                            "text": " MERGEFIELD  \"Merge Field1\" \\* Upper  \\* MERGEFORMAT "
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {},
                            "text": "«MERGE "
                        },
                        {
                            "characterFormat": {},
                            "imageString": "data:image/png;base64,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",
                            "isMetaFile": false,
                            "width": 160.5,
                            "height": 46.64102000000001,
                            "iscrop": false,
                            "name": "Picture 2",
                            "alternativeText": "Graphical user interface, text, application, email\n\nDescription automatically generated",
                            "visible": true,
                            "widthScale": 97.88756,
                            "heightScale": 97.612495,
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
                        },
                        {
                            "characterFormat": {},
                            "text": "FIELD»"
                        },
                        {
                            "characterFormat": {},
                            "fieldType": 1
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
                "listFormat": {}
            },
            "characterFormat": {},
            "next": "Normal"
        },
        {
            "name": "Heading 1",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 5,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "outlineLevel": "Level1",
                "listFormat": {}
            },
            "characterFormat": {
                "bold": true,
                "fontSize": 24,
                "fontFamily": "Times New Roman",
                "boldBidi": true,
                "fontSizeBidi": 24,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "link": "Heading 1 Char",
            "next": "Heading 1"
        },
        {
            "name": "Heading 1 Char",
            "type": "Character",
            "characterFormat": {
                "bold": true,
                "fontSize": 24,
                "fontFamily": "Times New Roman",
                "boldBidi": true,
                "fontSizeBidi": 24,
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
            "name": "Hyperlink",
            "type": "Character",
            "characterFormat": {
                "underline": "Single",
                "fontColor": "#0563C1FF"
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
                "lineSpacing": 1.0791666507720947,
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
                "lineSpacing": 1.0791666507720947,
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
                "lineSpacing": 1.0791666507720947,
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
                "lineSpacing": 1.0791666507720947,
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
                    "styleName": "Normal",
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
                    "styleName": "Normal",
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
                    "styleName": "Normal",
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
                    "styleName": "Normal",
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
                    "styleName": "Normal",
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
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {},
                "inlines": []
            }
        ]
    }
};
describe(' Get Field API validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get field code and result Returns `undefined`for non-field', () => {
        console.log('get field code and result Returns `undefined`for non-field');
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo).toBe(undefined);
    });
    it('get field code and result', () => {
        console.log('get field code and result');
        editor.openBlank();
        editor.editorModule.insertField('MERGEFIELD  best \\* Upper \\b (( \\f )) \\m \\v');
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo.code).toBe('MERGEFIELD  best \\* Upper \\b (( \\f )) \\m \\v');
        expect(fieldInfo.result).toBe('«best»');
    });
    it('Nested field code and result Returns `undefined`for non-field', () => {
        console.log('Nested field code and result Returns `undefined`for non-field');
        console.log('Nested field gets specified field information');
        editor.open(JSON.stringify(field_document));
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo).toBe(undefined);
    });
    it('Nested field gets specified field information', () => {
        console.log('Nested field gets specified field information');
        editor.open(JSON.stringify(field_document));
        editor.selection.select('0;0;0', '0;3;51');
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo.code).toBe('IF \" MERGEFIELD  \"Merge Field1\" \\* Upper  \\* MERGEFORMAT Paragraph 1TableParagraph 2 \" > 0 true false \\* MERGEFORMAT');
        expect(fieldInfo.result).toBe('false');
    });
});
describe(' Set Field API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = "";
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1000px;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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
        viewer = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('set field code and result Returns `undefined`for non-field', () => {
        console.log('set field code and result Returns `undefined`for non-field');
        editor.editorModule.setFieldInfo({ code: 'NUMPAGES  \\* Ordinal  \\* MERGEFORMAT', result: '1' });
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo).toBe(undefined);
    });
    it("set field code and result", () => {
        console.log('set field code and result');
        editor.openBlank();
        editor.editorModule.insertField('MERGEFIELD  best \\* Upper \\b (( \\f )) \\m \\v');
        editor.editorModule.setFieldInfo({ code: 'NUMPAGES  \\* Ordinal  \\* MERGEFORMAT', result: '1' });
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo.code).toBe('NUMPAGES  *1 * MERGEFORMAT');
        expect(fieldInfo.result).toBe('1');
    });
    it('Nested field gets Returns `undefined`for non-field', () => {
        console.log('Nested field gets Returns `undefined`for non-field');
        editor.open(JSON.stringify(field_document));
        editor.editorModule.setFieldInfo({ code: 'NUMPAGES  \\* Ordinal  \\* MERGEFORMAT', result: '1' });
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo).toBe(undefined);
    });
    it('Nested field gets replaced completely with the specified field information', () => {
        console.log('Nested field gets replaced completely with the specified field information');
        editor.open(JSON.stringify(field_document));
        editor.selection.select('0;0;0', '0;3;51');
        editor.editorModule.setFieldInfo({ code: 'NUMPAGES  \\* Ordinal  \\* MERGEFORMAT', result: '1' });
        let fieldInfo: FieldInfo = editor.selection.getFieldInfo();
        expect(fieldInfo.code).toBe('NUMPAGES  *1 * MERGEFORMAT');
        expect(fieldInfo.result).toBe('1');
    });
});
describe('Selection test script1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select All Testing', () => {
console.log('Select All Testing');
        editor.selection.selectAll();
        editor.viewer.updateScrollBars();
        expect('').toBe('');
    });
    it('navigate up and down on empty selection', () => {
console.log('navigate up and down on empty selection');
        editor.viewer.updateScrollBars();
        for (let i: number = 0; i < 100; i++) {
            editor.selection.moveNextPosition();
        }
        expect(editor.selection.isEmpty).toBe(true);
    });
    it('Select Current word', () => {
console.log('Select Current word');
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('Syncfusion ');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.selection.moveNextPosition();
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('Syncfusion ');
    });
    it('Selection on field', () => {
console.log('Selection on field');
        expect(editor.selection.getText(false)).toBe('');
        editor.selection.moveDown();
        editor.selection.moveNextPosition();
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('Document ');
    });
    it('Select Current word  on field end validation', () => {
console.log('Select Current word  on field end validation');
        editor.editorModule.insertText('https://syncfusion.com');
        editor.editorModule.handleTextInput(' ');
        editor.selectionModule.movePreviousPosition();
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('https://syncfusion.com ');
    });

});
describe('Selection test script2', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select Current Paragraph', () => {
console.log('Select Current Paragraph');
        editor.selection.selectParagraph();
        //expect(editor.selection.text).toBe('Syncfusion Software pvt ltd ');
        expect(editor.selection.text).not.toBe('');
    });
    it('select current word on field end', () => {
console.log('select current word on field end');
        editor.selection.moveDown();
        for (let i: number = 0; i < 8; i++) {
            editor.selection.moveNextPosition();
        }
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('Editor ');
    });
    it('get hyperlink field null', () => {
console.log('get hyperlink field null');
        for (let i: number = 0; i < 4; i++) {
            editor.selection.moveDown();
        }
        let begin: FieldElementBox = editor.selection.getHyperlinkField();
        expect(begin).toBe(undefined);
    });
});
describe('Selection test script3', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get hyperlink field null', () => {
console.log('get hyperlink field null');
        for (let i: number = 0; i < 2; i++) {
            editor.selection.moveDown();
        }
        let begin: FieldElementBox = editor.selection.getHyperlinkField();
        expect(begin).not.toBe(null);
        let link: string = editor.selection.getFieldCode(begin);
        expect(link).toBe('HYPERLINK "https://syncfusion.com/"');
    });
    it('Extend to word start and end', () => {
console.log('Extend to word start and end');
        expect(editor.selection.extendToWordStartEnd()).toBe(false);
    });
    it('Move to Next paragraph', () => {
console.log('Move to Next paragraph');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
    });

});
describe('Selection test scrip4', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Extend selection validation', () => {
console.log('Extend selection validation');
        editor.selection.extendToWordStartInternal(false);
        expect(editor.selection.isEmpty).toBe(true);
        editor.selection.extendToWordEndInternal(false);
        expect(editor.selection.text).toBe('Syncfusion ');
    });
    it('Selection extend to line start and end', () => {
console.log('Selection extend to line start and end');
        editor.selection.extendToLineStart();
        expect(editor.selection.isEmpty).toBe(true);
        editor.selection.extendToLineEnd();
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Extend to paragraph start and end', () => {
console.log('Extend to paragraph start and end');
        editor.selection.extendToParagraphStart();
        expect(editor.selection.isEmpty).toBe(true);
        editor.selection.extendToParagraphEnd();
        expect(editor.selection.isEmpty).toBe(false);
        editor.selection.extendToPreviousLine();
        expect(editor.selection.isEmpty).toBe(true);
    });
});
describe('Selection test script5', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Selection Move Next Position and move down with out clearing selection', () => {
console.log('Selection Move Next Position and move down with out clearing selection');
        editor.selection.selectCurrentWord();
        editor.selection.moveNextPosition();
        editor.selection.selectCurrentWord();
        for (let i = 0; i < 5; i++) {
            editor.selection.moveDown();
        }
        expect(editor.selection.end.paragraph.isInsideTable).toBe(true);
    });
    it('Selection Move up and move to previous paragraph', () => {
console.log('Selection Move up and move to previous paragraph');
        editor.selection.selectPosition(editor.documentEnd, editor.documentEnd);
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToPreviousParagraph();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        editor.selection.moveUp();
        editor.selection.moveUp();
    });
    it('Move to line end validation', () => {
console.log('Move to line end validation');
        editor.selection.moveToLineEnd();
        expect(editor.selection.end.offset).toBe(editor.selection.getParagraphLength(editor.selection.end.paragraph));
    });
});
describe('Selection test script6', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000)
    });
    it('Extent to next line validation', () => {
console.log('Extent to next line validation');
        for (let i: number = 0; i < 10; i++) {
            editor.selection.extendToNextLine();
        }
    });
    it('Move Text position on Mouse move', () => {
console.log('Move Text position on Mouse move');
        let point: Point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 30;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 100;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 120;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 140;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 160;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 180;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 30;
        editor.selection.moveTextPosition(point, editor.selection.end);
    });
    it('Selection inside paragraph', () => {
console.log('Selection inside paragraph');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        let point: Point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 30;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 40;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 50;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 60;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 70;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 80;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x + 15;
        point.y = point.y + 90;
        editor.selection.moveTextPosition(point, editor.selection.end);
    });
});
describe('Selection test scrip7', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000)
    });
    it('Select table ', () => {
console.log('Select table ');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        // editor.selection.selectTable();
    });
    it('select row', () => {
console.log('select row');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        // editor.selection.selectTableRow();
    });
    it('select row', () => {
console.log('select row');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        // editor.selection.selectTableCell();
    });
});
describe('Selection test script9', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000)
    });
    it('select row', () => {
console.log('select row');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveDown();
        // editor.selection.selectTableCell();
        editor.selection.selectTableCellInternal(editor.selection.end.paragraph.associatedCell, true);
        editor.selection.selectTableCellInternal(editor.selection.end.paragraph.associatedCell, false)
    });
    it('select column', () => {
console.log('select column');
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveToNextParagraph();
        editor.selection.moveDown();
        // editor.selection.selectColumn();
        expect(editor.selection.end).not.toBe(null);
        // editor.selection.clearSelectionHighlight();
    });
    it('Selection get block validation', () => {
console.log('Selection get block validation');
        expect(editor.selection.getBlock(undefined)).toBe(undefined);
    });
});
describe('Selection test script10', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get hyperlink field in cursor position', () => {
console.log('get hyperlink field in cursor position');
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        let point: Point = editor.selection.end.location;
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        let widget = editor.selection.getLineWidgetParagraph(0, line);
        let field = editor.selection.getHyperlinkField();
        expect(field).toBe(undefined);
    });
    it('get hyperlink field in cursor position with hyperlink', () => {
console.log('get hyperlink field in cursor position with hyperlink');
        editor.selection.moveDown();
        editor.selection.moveDown();
        let point: Point = editor.selection.end.location;
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        let widget = editor.selection.getLineWidgetParagraph(0, line);
        let field = editor.selection.getHyperlinkField();
        expect(field).not.toBe(null);
    });
    it('get hyperlink with out lie widget', () => {
console.log('get hyperlink with out lie widget');
        let point: Point = editor.selection.end.location;
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        let widget = editor.selection.getLineWidgetParagraph(0, line);
        let field = editor.selection.getHyperlinkField();
        expect(field).toBe(undefined);
    });
});
describe('Selection test script11', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select paragraph testing', () => {
console.log('Select paragraph testing');
        editor.selection.selectParagraphInternal(editor.selection.start.paragraph, false);
        expect(editor.selection.end.offset).toBe(editor.selection.getParagraphLength(editor.selection.end.paragraph));
        editor.selection.selectParagraphInternal(editor.selection.start.paragraph, true);
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Fit image to page testing', () => {
console.log('Fit image to page testing');
        let image = new ImageElementBox(null);
        image.width = 200;
        image.height = 300;
        (editor.editorModule as any).fitImageToPage(editor.selection, image);
        expect(image.width).toBe(200);
        expect(image.height).toBe(300);
        image.width = 900;
        image.height = 1500;
        (editor.editorModule as any).fitImageToPage(editor.selection, image);
        expect(image.width).not.toBe(900);
        expect(image.height).not.toBe(1500);

    });

});
describe('Selection test script12', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Move Cursor up and down', () => {
console.log('Move Cursor up and down');
        for (let i = 0; i < 12; i++) {
            editor.selection.moveDown();
        }
        for (let i = 0; i < 12; i++) {
            editor.selection.moveUp();
        }
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
    });
    it('Move Previous paragraph in cell', () => {
console.log('Move Previous paragraph in cell');
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        // editor.selection.selectTableCell();
        editor.selection.extendToWordStartInternal(false);
        editor.selection.extendToWordStartInternal(true);
        editor.selection.extendToWordStartInternal(false);
        editor.selection.extendToWordStartInternal(false);
        editor.selection.extendToWordStartInternal(false);
    });
    it('Move to next paragraph', () => {
console.log('Move to next paragraph');
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        // editor.selection.selectTableCell();
        editor.selection.extendToWordEndInternal(false);
        editor.selection.extendToWordEndInternal(true);
        editor.selection.extendToWordEndInternal(false);
        editor.selection.extendToWordEndInternal(false);
        editor.selection.extendToWordEndInternal(false);
    });
    it('Move previous Position', () => {
console.log('Move previous Position');
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        editor.selection.selectInternal(line, line.children[0], 0, editor.selection.getPhysicalPositionInternal(line, line.getEndOffset(), true));
        for (let i: number = 0; i < 8; i++) {
            editor.selection.movePreviousPosition();
        }
        expect('').toBe('');
    });
});
describe('Selection test script13', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Backward Shift + Left', () => {
console.log('Backward Shift + Left');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.moveNextPosition();
        }
        expect(editor.selection.isEmpty).toBe(true)
    });
    it('Extend backward selection without clearing multi selection', () => {
console.log('Extend backward selection without clearing multi selection');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.extendForward();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend backward selection', () => {
console.log('Extend backward selection');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.extendForward();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend up selection without clearing multi selection', () => {
console.log('Extend up selection without clearing multi selection');
        for (let i: number = 0; i < 30; i++) {
            editor.selection.extendToNextLine();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend previous position selection ', () => {
console.log('Extend previous position selection ');
        editor.selection.extendToPreviousLine();
        expect(editor.selection.isEmpty).toBe(true)
    });
});
describe('Back ward Selection validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentEnd, editor.documentEnd);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Move text position backward', () => {
console.log('Move text position backward');
        let point: Point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 30;
        editor.selection.moveTextPosition(point, editor.selection.end);
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 100;
        editor.selection.moveTextPosition(point, editor.selection.end);;
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 120;
        editor.selection.moveTextPosition(point, editor.selection.end);;
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 140;
        editor.selection.moveTextPosition(point, editor.selection.end);;
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 160;
        editor.selection.moveTextPosition(point, editor.selection.end);;
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 180;
        editor.selection.moveTextPosition(point, editor.selection.end);;
        point = editor.selection.end.location;
        point.x = point.x - 15;
        point.y = point.y - 30;
        editor.selection.moveTextPosition(point, editor.selection.end);;
    });
    it('Backward Shift + Left', () => {
console.log('Backward Shift + Left');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.movePreviousPosition();
        }
        expect(editor.selection.isEmpty).toBe(true)
    });
    it('Extend backward selection without clearing multi selection', () => {
console.log('Extend backward selection without clearing multi selection');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.extendBackward();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend backward selection', () => {
console.log('Extend backward selection');
        for (let i: number = 0; i < 100; i++) {
            editor.selection.extendBackward();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend up selection without clearing multi selection', () => {
console.log('Extend up selection without clearing multi selection');
        for (let i: number = 0; i < 30; i++) {
            editor.selection.extendToPreviousLine();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Extend up selection ', () => {
console.log('Extend up selection ');
        for (let i: number = 0; i < 30; i++) {
            editor.selection.extendToPreviousLine();
        }
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('Move up from document end', () => {
console.log('Move up from document end');
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.selection.moveUp();
        let cell = editor.selection.getPreviousSelectionCell(editor.selection.start.paragraph.associatedCell);
        expect(cell).not.toBe(null);
    });
});
// describe('Paste Testing', () => {
//     let editor: DocumentEditor;
//     let documentHelper: DocumentHelper;
//     beforeAll(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
//         document.body.innerHTML = '';
//         document.body.appendChild(ele);
//         DocumentEditor.Inject(Editor, Selection);
//         editor = new DocumentEditor({ enableEditor: true,enableSelection: true, isReadOnly: false });
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//        documentHelper=editor.documentHelper;
//     });
//     beforeEach(() => {
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//     });
//     afterAll(() => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         documentHelper = undefined;
//     });
//     it('Paste Testing', () => {
//         let clipboardEvent = {
//             clipboardData: { getData: () => { return 'Syncfusion'; } }
//         };
//         editor.editorModule.insertText('Syncfusion', true);
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         editor.editorModule.pasteInternal(null, clipboardEvent);
//         editor.selection.selectAll();
//         expect(editor.selection.text.length).toBe(21);
//         let clipboardEvent1 = {
//             clipboardData: { getData: () => { return ''; } }
//         };
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         editor.editorModule.pasteInternal(null, clipboardEvent1);
//         editor.selection.selectAll();
//         expect(editor.selection.text.length).toBe(21);
//     });
//     it('Paste Testing from documentHelper', () => {
//         let clipboardEvent: any = {
//             clipboardData: { getData: () => { return 'Syncfusion'; } }
//         };
//         documentHelper.document = editor.createEmptyDocument();
//         editor.editorModule.insertText('Syncfusion', true);
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         documentHelper.onPaste(clipboardEvent);
//         editor.selection.selectAll();
//         expect(editor.selection.text.length).toBe(21);
//         let clipboardEvent1 = {
//             clipboardData: { getData: () => { return ''; } }
//         };
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         editor.editorModule.pasteInternal(null, clipboardEvent1);
//         editor.selection.selectAll();
//         expect(editor.selection.text.length).toBe(21);
//     });
//     it('Pasteinternal Testing', () => {
//         let clipboardEvent = {
//             clipboardData: { getData: () => { return 'Syncfusion'; } }
//         };
//         let htmlContent = "<p style=font-style:normal; background - color:NoColor; color: #2E74B5; font - size:18px; font - family:Calibri; text - align:justify; margin: 24px 0px 40px 0px; line - height:114.99999761581421 %;><span style=font - style:normal; background - color:NoColor; color: #2E74B5; font - size:18px; font - family:Calibri;>Adventure & nbsp; Works < /span><span style=font-style:normal;background-color:NoColor;color:#2E74B5;font-size:18px;font-family:Calibri;>.</span > <span style=font - style:normal; background - color:NoColor; color: #2E74B5; font - size:18px; font - family:Calibri;>&nbsp; Cycles < /span><span style=font-style:normal;background-color:NoColor;color:#2E74B5;font-size:18px;font-family:Calibri;>&nbsp;</span > </p>";
//         editor.enablePaste = true;
//         editor.co = htmlContent;
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         editor.editorModule.pasteInternal(null, clipboardEvent);
//         editor.selection.selectAll();
//         expect(editor.selection.text.length).toBe(74);
//     });
// });
describe('selection Widget info validation', () => {
    it('selection Widget info validation', () => {
console.log('selection Widget info validation');
        let widgetInfo = new SelectionWidgetInfo(10, 10);
        widgetInfo.destroy();
        expect(widgetInfo.left).toBe(undefined);
    });
});
describe('Selection Validation for branch ', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get Fields from parageph', () => {
console.log('get Fields from parageph');
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        let field: FieldElementBox[] = editor.documentHelper.fields;
        editor.selection.getHyperLinkFields(editor.selection.start.paragraph, field, false);
        expect(field.length).toBe(1);
    });
});


describe('Selection Module Unit Test script', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    // it('Check if the selection range is exist', () => {
    //     editor.selection.selectAll();
    //     let range = editor.selection.ranges[0];
    //     editor.selection.selectionRanges.ranges.push(range);
    //     // editor.selection.checkSelectionRangesIsExist(viewer,  editor.selection.start,  editor.selection.end);        
    // });
    it('Apply left indent With selection', () => {
console.log('Apply left indent With selection');
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        expect(isNullOrUndefined(editor.selection.paragraphFormat.leftIndent)).toBe(true);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    it('Apply Left indent in empty selection', () => {
console.log('Apply Left indent in empty selection');
        editor.editorModule.onApplyParagraphFormat('leftIndent', 48, true, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(96);
    });
});

describe('update table format validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(selection_document());
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Apply hight light color validation', () => {
console.log('Apply hight light color validation');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        editor.editorModule.toggleHighlightColor();
        expect(editor.selection.characterFormat.highlightColor).toBe('Yellow');
        editor.editorModule.toggleHighlightColor();
        expect(editor.selection.characterFormat.highlightColor).toBe('NoColor');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.highlightColor).toBe('Yellow');
    });
});

describe('Selection API validation For field ', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    // it('Get Paragraph from previsous section', () => {
    //     let word: WordDocument = new WordDocument();
    //     let section1: BodyWidget = new BodyWidget();
    //     let table: TableWidget = new TableWidget();
    //     let row: TableRowWidget = new TableRowWidget();
    //     let cell: TableCellWidget = new TableCellWidget();
    //     let paragaph1: ParagraphWidget = new ParagraphWidget();
    //     cell.childWidgets.push(paragaph1);
    //     row.childWidgets.push(cell);
    //     table.childWidgets.push(row);
    //     section1.childWidgets.push(table);
    //      let section2: BodyWidget = new BodyWidget();         section2.sectionFormat=new WSectionFormat();
    //     let paragraph = new ParagraphWidget();
    //     section2.childWidgets.push(paragraph);
    //     word.sections.push(section1);
    //     word.sections.push(section2);
    //     documentHelper.document = word;
    //     expect(editor.selectionModule.getPreviousSelection(section2)).toBe(paragaph1);
    // });
    it('Is Exist after validation', () => {
console.log('Is Exist after validation');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        let cell: TableCellWidget = new TableCellWidget();
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 0;

        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        let cell2: TableCellWidget = new TableCellWidget();
        let paragarph2: ParagraphWidget = new ParagraphWidget();
        paragarph2.index = 1;
        cell2.childWidgets.push(paragarph2);
        row.childWidgets.push(cell2);

        let row2: TableRowWidget = new TableRowWidget();
        let cell3: TableCellWidget = new TableCellWidget();
        let paragarph3: ParagraphWidget = new ParagraphWidget();
        paragarph3.index = 2;
        cell3.childWidgets.push(paragarph3);
        row2.childWidgets.push(cell3);
        table.childWidgets.push(row2);
        expect(editor.selectionModule.isExistAfter(paragarph2, paragraph)).toBe(true);
        expect(editor.selectionModule.isExistAfter(paragarph3, paragraph)).toBe(true);
    });

    it('Move to paragraph validation', () => {
console.log('Move to paragraph validation');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.selectionModule.selectPosition(editor.documentStart, editor.documentStart);
        editor.selection.handleControlShiftDownKey();
        expect(editor.selection.start.paragraph).toBe(editor.selection.end.paragraph);
        expect(editor.selection.end.offset).toBe((editor.selection.end.paragraph.childWidgets[0] as LineWidget).getEndOffset() + 1);
        editor.selection.handleControlShiftDownKey();
        expect(editor.selection.start.paragraph).not.toBe(editor.selection.end.paragraph);
        expect(editor.selection.end.offset).toBe((editor.selection.end.paragraph.childWidgets[0] as LineWidget).getEndOffset() + 1);
    });
    it('Move to paragraph start validation', () => {
console.log('Move to paragraph start validation');
        editor.openBlank();
        editor.editorModule.insertTextInternal('https://syncfusion.com', true);
        editor.editorModule.handleTextInput(' ');
        editor.selection.moveToLineStart();
        editor.editorModule.handleShiftEnter();
        editor.selection.moveToLineStart();
        editor.selection.moveDown();
        // expect(editor.selection.end.offset).toBe(1);
        editor.selection.moveUp();
        expect(editor.selection.end.offset).toBe(0);
    });

});
describe('Move To paragraph start validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get editing context testing', () => {
console.log('get editing context testing');
        editor.openBlank();
        editor.editorModule.insertTextInternal('syncfusion software', true);
        let type = editor.selection.contextType;
        expect(type).toBe('Text');
    });
});


describe('Get next and previous rendered block validation', () => {
    let selection: Selection;
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        selection = editor.selection;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('get next block selection', (done) => {
console.log('get next block selection');
        let section2: BodyWidget = new BodyWidget();
        section2.sectionFormat = new WSectionFormat();
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = section2;
        paragraph.index = 0;
        section2.childWidgets.push(paragraph);
        let paragraph2: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 1;
        paragraph2.containerWidget = section2;
        section2.childWidgets.push(paragraph2);
        let sections: BodyWidget[] = [];
        sections.push(section2);
        documentHelper.onDocumentChanged(sections);
        setTimeout(() => {
            expect(selection.getNextSelectionBlock(paragraph)).toBe(paragraph2);
            expect(selection.getNextSelectionBlock({} as any)).toBe(undefined);
            // expect(selection.getPreviousBlockInSection({} as any)).toBe(undefined);
            expect(selection.getPreviousSelectionBlock({} as any)).toBe(undefined);
            done();
        });
    });
    it('Get Next rendered element with next node', () => {
console.log('Get Next rendered element with next node');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = section;
        paragraph.index = 0;
        let paragraph1: ParagraphWidget = new ParagraphWidget();
        paragraph1.containerWidget = section;
        paragraph1.index = 1;
        section.childWidgets.push(paragraph);
        section.childWidgets.push(paragraph1);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        expect(selection.getNextRenderedBlock(paragraph)).toBe(paragraph1);

    });
    it('Get Next Paragraph validation', () => {
console.log('Get Next Paragraph validation');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = section;
        paragraph.index = 0;
        let paragraph1: ParagraphWidget = new ParagraphWidget();
        paragraph1.containerWidget = section;
        paragraph1.index = 1;
        section.childWidgets.push(paragraph);
        section.childWidgets.push(paragraph1);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        expect(selection.getNextParagraphBlock(paragraph)).toBe(paragraph1);
        expect(selection.getNextParagraphBlock(paragraph1)).toBe(undefined);

    });
    it('get next paragraph without owner', () => {
console.log('get next paragraph without owner');
        let paragraph: ParagraphWidget = new ParagraphWidget();
        expect(selection.getNextParagraphBlock(paragraph)).toBe(undefined);
        paragraph.destroy();
    });
    it('get next paragraph from table', () => {
console.log('get next paragraph from table');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let paragraph1: ParagraphWidget = new ParagraphWidget();
        paragraph1.containerWidget = section;
        paragraph1.index = 0;
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        section.childWidgets.push(paragraph1);
        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        expect(selection.getNextParagraphBlock(paragraph1)).toBe(paragraph);
        expect(selection.getPreviousParagraphBlock(paragraph)).toBe(paragraph1);

    });
    it('Get Next Block inside table', () => {
console.log('Get Next Block inside table');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let paragraph1: ParagraphWidget = new ParagraphWidget();
        paragraph1.containerWidget = section;
        paragraph1.index = 1;
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 0;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        section.childWidgets.push(table);
        section.childWidgets.push(paragraph1);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        expect(selection.getNextParagraphBlock(paragraph)).toBe(paragraph1);
        expect(selection.getPreviousParagraphBlock(paragraph1)).toBe(paragraph);

    });
});
describe('Insert Hyperlink Validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableSelection: true, enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert Hyperlink With new display text', () => {
console.log('Insert Hyperlink With new display text');
        editor.openBlank();
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Bing', true);
        let line: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line.children.length).toBe(5);
    });
    it('insert hyperlink with same display name', () => {
console.log('insert hyperlink with same display name');
        editor.openBlank();
        editor.editorModule.insertText('Google');
        let span: TextElementBox = editor.selection.start.currentWidget.children[0] as TextElementBox;
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 0, false);
        editor.selection.start.offset = 0;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, span.text.length, false);
        editor.selection.end.offset = span.text.length;
        editor.selection.end.currentWidget = editor.selection.end.currentWidget;
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Google', false);
        let line2: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line2.children.length).toBe(5);
    });
    it('insert hyperlink with same display name', () => {
console.log('insert hyperlink with same display name');
        editor.openBlank();
        editor.openBlank();
        editor.editorModule.insertText('Google');
        let span: TextElementBox = editor.selection.start.currentWidget.children[0] as TextElementBox;
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 0, false);
        editor.selection.start.offset = 0;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, span.text.length, false);
        editor.selection.end.offset = span.text.length;
        editor.selection.end.currentWidget = editor.selection.end.currentWidget;
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Bing', true);
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Google', true);
        let line2: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line2.children.length).toBe(10);
    });
    it('insert hyperlink with same display name back ward selection', () => {
console.log('insert hyperlink with same display name back ward selection');
        editor.openBlank();
        editor.openBlank();
        editor.editorModule.insertText('Google');
        let span: TextElementBox = editor.selection.start.currentWidget.children[0] as TextElementBox;
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 0, false);
        editor.selection.start.offset = 0;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, span.text.length, false);
        editor.selection.end.offset = span.text.length;
        editor.selection.end.currentWidget = editor.selection.end.currentWidget;
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Google', false);
        editor.editorModule.insertHyperlinkInternal('http://google.com', 'bing', false);
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 40, false);
        editor.selection.start.offset = 40;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, 40, false);
        editor.selection.end.offset = 40;
        editor.editorModule.insertHyperlinkInternal('http://google.com', 'Google', true);
        let line2: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line2.children.length).toBe(15);
    });
    it('Edit hyperlink with same display name back ward selection', () => {
console.log('Edit hyperlink with same display name back ward selection');
        editor.openBlank();
        editor.openBlank();
        editor.editorModule.insertText('Google');
        let span: TextElementBox = editor.selection.start.currentWidget.children[0] as TextElementBox;
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 0, false);
        editor.selection.start.offset = 0;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, span.text.length, false);
        editor.selection.end.offset = span.text.length;
        editor.selection.end.currentWidget = editor.selection.end.currentWidget;
        editor.editorModule.insertHyperlinkInternal('http://bing.com', 'Google', true);
        editor.selection.start.location = editor.selection.getPhysicalPositionInline(span, 35, false);
        editor.selection.start.offset = 35;
        editor.selection.end.location = editor.selection.getPhysicalPositionInline(span, 35, false);
        editor.selection.end.offset = 35;
        editor.editorModule.insertHyperlinkInternal('http://google.com', 'Bing', true);
        let line2: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(line2.children.length).toBe(5);
        editor.editorModule.removeHyperlink();
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    // it('Insert hyperlink on nested field validation', () => {
    //     editor.openBlank();
    //     let sections: BodyWidget[] = [];
    //     let section: BodyWidget = new BodyWidget();
    //     let paragraph: ParagraphWidget = new ParagraphWidget();
    //     let line: LineWidget = new LineWidget(paragraph);
    //     paragraph.childWidgets.push(line);
    //     line.children.push(new FieldElementBox(0));
    //     let span: TextElementBox = new TextElementBox();
    //     span.text = 'Temp';
    //     line.children.push(span);
    //     line.children.push(new FieldElementBox(2));
    //     line.children.push(new FieldElementBox(0));
    //     let codeSpan: TextElementBox = new TextElementBox();
    //     span.text = ' HYPERLINK \"https:\\google.com\" ';
    //     line.children.push(codeSpan);
    //     line.children.push(new FieldElementBox(2));
    //     let resultSpan: TextElementBox = new TextElementBox();
    //     resultSpan.text = 'Google';
    //     line.children.push(resultSpan);
    //     line.children.push(new FieldElementBox(1));
    //     let resultSpan1: TextElementBox = new TextElementBox();
    //     resultSpan.text = 'Google';
    //     line.children.push(resultSpan1);
    //     line.children.push(new FieldElementBox(1));
    //     section.childWidgets.push(paragraph);
    //     sections.push(section);
    //     editor.documentHelper.onDocumentChanged(sections);
    //     editor.selection.start.location = editor.selection.getPhysicalPositionInline(resultSpan, 38, false);
    //     editor.selection.start.offset = 38;
    //     (editor.selection.start as any).currentParagraph = paragraph;

    //     editor.selection.end.location = editor.selection.getPhysicalPositionInline(resultSpan, 38, false);
    //     editor.selection.end.offset = 38;
    //     (editor.selection.end as any).currentParagraph = paragraph;
    //     editor.editorModule.insertHyperlink('http://google.com', 'Bing', true);
    //     let line2: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
    //     expect(line2.children.length).toBe(5);
    // });
});

describe('Get Cell and Block Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let selection: Selection;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        selection = editor.selection;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Get block from last cell with empty cell', () => {
console.log('Get block from last cell with empty cell');
        let table: TableWidget = new TableWidget();
        expect(selection.getLastBlockInLastCell(table)).toBe(undefined);
    });
    it('Get Block from last cell', () => {
console.log('Get Block from last cell');
        editor.editor.insertTable(1, 2);
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('2');
        let paragraph = selection.start.paragraph;
        let table = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(selection.getLastBlockInLastCell(table)).toBe(paragraph);
    });
    it('Get first Block from First cell validation', () => {
console.log('Get first Block from First cell validation');
        let table: TableWidget = new TableWidget();
        table.childWidgets = [];
        expect(selection.getFirstBlockInFirstCell(table)).toBe(undefined);
    });
    it('Get Block from last cell', () => {
console.log('Get Block from last cell');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        let cell: TableCellWidget = new TableCellWidget();
        let cell2: TableCellWidget = new TableCellWidget();
        let paragraph: ParagraphWidget = new ParagraphWidget();
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        row.childWidgets.push(cell2);
        table.childWidgets.push(row);
        expect(selection.getFirstBlockInFirstCell(table)).toBe(paragraph);
    });
    it('Get Block from last cell', () => {
console.log('Get Block from last cell');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        let cell: TableCellWidget = new TableCellWidget();
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        expect(selection.getFirstBlockInFirstCell(table)).toBe(undefined);
    });
    it('First paragraph in last row with out row', () => {
console.log('First paragraph in last row with out row');
        let table: TableWidget = new TableWidget();
        expect(selection.getFirstParagraphInLastRow(table)).toBe(undefined);
    });
    it('First paragraph in last row with row', () => {
console.log('First paragraph in last row with row');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        let cell: TableCellWidget = new TableCellWidget();
        let table2: TableWidget = new TableWidget();
        cell.childWidgets.push(table2);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        expect(selection.getFirstParagraphInLastRow(table)).toBe(undefined);
    });
    it('First block from empty cell validation', () => {
console.log('First block from empty cell validation');
        let cell: TableCellWidget = new TableCellWidget();
        expect(selection.getFirstBlock(cell)).toBe(undefined);
    });
    it('First block from cell validation', () => {
console.log('First block from cell validation');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        expect(selection.getCellInTable(table, cell)).toBe(cell);
    });
    it('First block from nested cell validation', () => {
console.log('First block from nested cell validation');
        let table: TableWidget = new TableWidget();
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        let table1: TableWidget = new TableWidget();
        table1.containerWidget = cell;
        let row1: TableRowWidget = new TableRowWidget();
        row1.containerWidget = table1;
        let cell1: TableCellWidget = new TableCellWidget();
        cell1.containerWidget = row1;
        row1.childWidgets.push(cell1);
        table1.childWidgets.push(row1);
        cell.childWidgets.push(table1);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        expect(selection.getCellInTable(table1, cell)).toBe(cell);
    });
});

describe('Get previous valid line ', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let selection: Selection;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        selection = editor.selection;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Get previous valid inline', () => {
console.log('Get previous valid inline');
        let span: TextElementBox = new TextElementBox();
        expect(selection.getPreviousValidElement(span)).toBe(span);
    });
    // it('Get previous valid inline', () => {
    //     let fieldEnd: FieldElementBox = new FieldElementBox(1);
    //     expect(selection.getPreviousValidElement(fieldEnd)).toBe(undefined);
    // });
    it('Get Previous valid inline of FieldEnd', () => {
console.log('Get Previous valid inline of FieldEnd');
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        let end = editor.selection.start.currentWidget.children[4];
        let separator = editor.selection.start.currentWidget.children[2];
        let begin = editor.selection.start.currentWidget.children[0];
        expect(selection.getPreviousValidElement(end)).toBe(end);
        expect(selection.getPreviousValidElement(separator)).toBe(begin);
    });
    it('get next valid inline with out field separator', () => {
console.log('get next valid inline with out field separator');
        editor.editorModule.insertText('www.google.com');
        editor.editorModule.insertText(' ');
        editor.selection.start.currentWidget.children.splice(2, 1);
        let end = editor.selection.start.currentWidget.children[3];
        let begin = editor.selection.start.currentWidget.children[0];
        expect(selection.getPreviousValidElement(end)).not.toBe(begin);
    });
    it('Validate text position testing', () => {
console.log('Validate text position testing');
        editor.editorModule.insertHyperlinkInternal('http://syncfusion.com', 'Syncfusion Software', true);

        let result = editor.selection.start.currentWidget.children[3] as TextElementBox;
        let end = editor.selection.start.currentWidget.children[4];
        let begin = editor.selection.start.currentWidget.children[0];
        expect(selection.validateTextPosition(result, result.length).element).toBe(end);
        expect(selection.validateTextPosition(result, 0).element).toBe(begin);
        expect(selection.isLastRenderedInline(result, result.length)).toBe(false);
        let temp: TextElementBox = new TextElementBox();
        temp.text = 'Syncfusion';
        editor.selection.handleHomeKey();
        editor.editorModule.insertInlineInSelection(editor.selection, temp);
        expect(selection.validateTextPosition(temp, temp.length).element).toBe(temp);
        expect(selection.validateTextPosition(temp, 2).element).toBe(temp);
        expect(selection.validateTextPosition(temp, 0).element).toBe(temp);
        expect(selection.isLastRenderedInline(temp, temp.length)).toBe(false);
    });
    it('Get Next text inline', () => {
console.log('Get Next text inline');
        let span1: TextElementBox = new TextElementBox();
        span1.text = 'Syncfusion Software';
        span1.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span1);
        let span2: TextElementBox = new TextElementBox();
        span2.text = 'https://syncfusion.com';
        span2.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span2);
        editor.editorModule.insertHyperlinkInternal('http://syncfusion.com', 'Syncfusion Software', true);
        let paragaph: ParagraphWidget = new ParagraphWidget();
        let begin = editor.selection.start.currentWidget.children[2];
        let span = editor.selection.start.currentWidget.children[3];
        let separator = editor.selection.start.currentWidget.children[4];
        let result = editor.selection.start.currentWidget.children[5];
        let end = editor.selection.start.currentWidget.children[6];

        expect(selection.getNextTextInline(span1)).toBe(span2);
        expect(selection.getNextTextInline(span2)).toBe(begin);
        expect(selection.getNextTextInline(end)).toBe(undefined);
        expect(selection.getNextTextInline(span)).toBe(end);
    });
    it('get Next rendered inline', () => {
console.log('get Next rendered inline');
        let span1: TextElementBox = new TextElementBox();
        span1.text = 'Syncfusion Software';
        span1.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span1);
        let span2: TextElementBox = new TextElementBox();
        span2.text = 'https://syncfusion.com';
        span2.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span2);
        editor.editorModule.insertHyperlinkInternal('http://syncfusion.com', 'Syncfusion Software', true);
        let paragaph: ParagraphWidget = new ParagraphWidget();
        let begin = editor.selection.start.currentWidget.children[2];
        let span = editor.selection.start.currentWidget.children[3];
        let separator = editor.selection.start.currentWidget.children[4];
        let result = editor.selection.start.currentWidget.children[5];
        let end = editor.selection.start.currentWidget.children[6];

        expect(selection.getNextRenderedElementBox(span1, 0)).toBe(span1);
        expect(selection.getNextRenderedElementBox(span2, span2.length)).toBe(separator);
        expect(selection.getNextRenderedElementBox(result, result.length)).toBe(end);
    });
});

describe('is exist after inline', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let selection: Selection;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        selection = editor.selection;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('is Exist after in line validation', () => {
console.log('is Exist after in line validation');
        let span: TextElementBox = new TextElementBox();
        span.text = 'Syncfusion Software';
        span.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span);
        let span1: TextElementBox = new TextElementBox();
        span1.text = 'https://syncfusion.com';
        span1.line = editor.selection.start.currentWidget;
        editor.editorModule.insertInlineInSelection(selection, span1);
        editor.selection.start.setPositionInternal(selection.getDocumentStart());
        editor.selection.end.setPositionInternal(selection.getDocumentStart());
        span = editor.selection.start.currentWidget.children[0] as TextElementBox;
        span1 = editor.selection.start.currentWidget.children[1] as TextElementBox;
        expect(selection.isExistAfterInline(span, span1)).toBe(false);
        expect(selection.isExistAfterInline(span1, span)).toBe(true);
        expect(selection.isExistBeforeInline(span, span1)).toBe(true);
        expect(selection.isExistBeforeInline(span1, span)).toBe(false);
    });
    it('is Exist After in different section in side table', () => {
console.log('is Exist After in different section in side table');
        editor.editorModule.insertText('Syncfusion Software');
        let span = selection.start.currentWidget.children[0];
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('https://syncfusion.com');

        let section: BodyWidget = new BodyWidget();
        let paragaph: ParagraphWidget = new ParagraphWidget();
        let span1 = selection.start.currentWidget.children[0];
        editor.selection.start.setPositionInternal(selection.getDocumentStart());
        editor.selection.end.setPositionInternal(selection.getDocumentStart());
        expect(selection.isExistAfterInline(span, span1)).toBe(false);
        expect(selection.isExistAfterInline(span1, span)).toBe(true);
        expect(selection.isExistBeforeInline(span, span1)).toBe(true);
        expect(selection.isExistBeforeInline(span1, span)).toBe(false);
    });
    it('is Exist After inline with paragraph and table', () => {
console.log('is Exist After inline with paragraph and table');
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertText('Syncfusion Software');
        editor.editorModule.onEnter();
        editor.editorModule.insertText('https://syncfusion.com');
        let section: BodyWidget = new BodyWidget();
        let paragaph: ParagraphWidget = new ParagraphWidget();
        let span1 = selection.start.currentWidget.children[0];
        let span = (editor.selection.start.currentWidget.paragraph.previousWidget.childWidgets[0] as LineWidget).children[0];
        editor.selection.start.setPositionInternal(selection.getDocumentStart());
        editor.selection.end.setPositionInternal(selection.getDocumentStart());
        expect(selection.isExistAfterInline(span, span1)).toBe(false);
        expect(selection.isExistAfterInline(span1, span)).toBe(true);
        expect(selection.isExistBeforeInline(span, span1)).toBe(true);
        expect(selection.isExistBeforeInline(span1, span)).toBe(false);
    });
});



describe('Left Indent Validation', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'))
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, true, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(20);
    });
    it('Apply left indent Empty Selection', () => {
console.log('Apply left indent Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(20);
    });
    it('Apply left indent Empty Selection with update', () => {
console.log('Apply left indent Empty Selection with update');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, true, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(20);
    });
    it('Apply left indent Empty Selection with update back ward selection', () => {
console.log('Apply left indent Empty Selection with update back ward selection');
        editor.openBlank();
        editor.selection.selectPosition(editor.documentEnd, editor.documentStart);
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, true, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(20);
    });
    it('Apply left indent Empty Selection', () => {
console.log('Apply left indent Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(20);
    });
    it('Apply left indent Empty Selection', () => {
console.log('Apply left indent Empty Selection');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(0);
        //Apply left indent Empty Selection
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('leftIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(0);
    });
});

describe('Apply Right indent', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.isReadOnly = false;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('rightIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.rightIndent).toBe(20);
    });
    it('Apply left indent Empty Selection', () => {
console.log('Apply left indent Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('rightIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.rightIndent).toBe(20);
    });
    it('Apply right indent Empty Selection', () => {
console.log('Apply right indent Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('rightIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.rightIndent).toBe(20);
        editor.editorHistory.undo();
    });
    it('Apply right indent Empty Selection', () => {
console.log('Apply right indent Empty Selection');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('rightIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.rightIndent).toBe(0);
        //Apply right indent Empty Selection
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('rightIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.rightIndent).toBe(0);
    });
});

describe('Apply first line indent', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('firstLineIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(20);
    });
    it(' Apply first line indent Empty Selection', () => {
console.log(' Apply first line indent Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('firstLineIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(20);
    });
    it('Apply first line indent Empty Selection', () => {
console.log('Apply first line indent Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('firstLineIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(20);
        editor.editorHistory.undo();
    });
    it(' Apply first line indent Empty Selection on read only', () => {
console.log(' Apply first line indent Empty Selection on read only');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('firstLineIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(0);
        //Apply first line indent Empty Selection  on read only
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('firstLineIndent', 20, false, false);
        expect(editor.selection.paragraphFormat.firstLineIndent).toBe(0);
    });
});

describe('Apply before spacing indent', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.isReadOnly = false;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(20);
    });
    it(' Apply before spacing indent Empty Selection', () => {
console.log(' Apply before spacing indent Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(20);
    });
    it('Apply before spacing indent Empty Selection', () => {
console.log('Apply before spacing indent Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(20);
        editor.editorHistory.undo();
    });
    it(' Apply before spacing indent Empty Selection on read only', () => {
console.log(' Apply before spacing indent Empty Selection on read only');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0);
        //Apply before spacing indent Empty Selection  on read only
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('beforeSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0);
    });
});

describe('Apply after spacing indent', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');

    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'))
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.isReadOnly = false;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('afterSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(20);
    });
    it(' Apply after spacing indent Empty Selection', () => {
console.log(' Apply after spacing indent Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('afterSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(20);
        editor.editorHistory.undo();
    });
    it('Apply after spacing indent Empty Selection', () => {
console.log('Apply after spacing indent Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('afterSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(20);
    });
    it(' Apply after spacing indent Empty Selection on read only', () => {
console.log(' Apply after spacing indent Empty Selection on read only');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('afterSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
        //Apply after spacing indent Empty Selection  on read only
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('afterSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.afterSpacing).toBe(0);
    });
});

describe('Apply line spacing', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.isReadOnly = false;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(20);
    });
    it(' Apply line spacing Empty Selection', () => {
console.log(' Apply line spacing Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(20);
    });
    it('Apply line spacing Empty Selection', () => {
console.log('Apply line spacing Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('lineSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(20);
        editor.editorHistory.undo();
    });
    it(' Apply line spacing Empty Selection on read only', () => {
console.log(' Apply line spacing Empty Selection on read only');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1);
        //Apply line spacing Empty Selection  on read only
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('lineSpacing', 20, false, false);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1);
    });
});

describe('Apply line spacing type', () => {
    let editor: DocumentEditor;
    beforeAll(() => {
        let element: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Update paragraph format', () => {
console.log('Update paragraph format');
        editor.isReadOnly = false;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacingType', 'AtLeast', false, false);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
    });
    it('Apply line spacing  type Empty Selection', () => {
console.log('Apply line spacing  type Empty Selection');
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacingType', 'Exactly', false, false);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Exactly');
    });
    it('Apply line spacing type Empty Selection', () => {
console.log('Apply line spacing type Empty Selection');
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('lineSpacingType', 'Multiple', false, false);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        editor.editorHistory.undo();
    });
    it('Apply line spacing type Empty Selection on read only', () => {
console.log('Apply line spacing type Empty Selection on read only');
        editor.isReadOnly = true;
        editor.openBlank();
        editor.editorModule.onApplyParagraphFormat('lineSpacingType', 'AtLeast', false, false);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        //Apply line spacing type Empty Selection  on read only
        editor.openBlank();
        editor.selection.selectAll();
        editor.editorModule.onApplyParagraphFormat('lineSpacingType', 'AtLeast', false, false);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
    });
});




describe('Get Next and previous selected cell', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let selection: Selection;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        selection = editor.selection;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Get next Selected cell', () => {
console.log('Get next Selected cell');
        editor.openBlank();
        editor.editorModule.insertTable(1, 2);
        let cell: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[0] as TableCellWidget;
        let cell2: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[1] as TableCellWidget;
        let paragaph: ParagraphWidget = cell2.childWidgets[0] as ParagraphWidget;
        expect(selection.getNextSelectionCell(cell)).toBe(paragaph)
    });
    it('get Next paragraph cell', () => {
console.log('get Next paragraph cell');
        editor.openBlank();
        editor.editorModule.insertTable(1, 2);
        let cell: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[0] as TableCellWidget;
        let cell2: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[1] as TableCellWidget;
        let paragaph: ParagraphWidget = cell2.childWidgets[0] as ParagraphWidget;
        expect(selection.getNextParagraphCell(cell)).toBe(paragaph);
    });

    it('get previous paragraph cell', () => {
console.log('get previous paragraph cell');
        editor.openBlank();
        editor.editorModule.insertTable(1, 2);
        let cell: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[1] as TableCellWidget;
        let cell2: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[0] as TableCellWidget;
        let paragaph: ParagraphWidget = cell2.childWidgets[0] as ParagraphWidget;
        expect(selection.getPreviousParagraphCell(cell)).toBe(paragaph);
    });

    it('get container cell validation', () => {
console.log('get container cell validation');
        editor.openBlank();
        editor.editorModule.insertTable(1, 2);
        let cell: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerRow.childWidgets[0] as TableCellWidget;
        expect(selection.getContainerCell(cell)).toBe(cell);
    });
    it('get container nested cell', () => {
console.log('get container nested cell');
        editor.openBlank();
        editor.editorModule.insertTable(1, 2);
        editor.editorModule.insertTable(1, 2);
        let cell: TableCellWidget = editor.selection.start.paragraph.associatedCell.ownerTable.associatedCell;
        let cell1: TableCellWidget = editor.selection.start.paragraph.associatedCell;
        expect(selection.getContainerCell(cell1)).toBe(cell);
    });
});

let shapeSfdt: any = {
    "sections": [
        {
            "blocks": [
                {
                    "characterFormat": {
                        "fontSize": 20.0,
                        "fontFamily": "Arial",
                        "fontSizeBidi": 20.0,
                        "fontFamilyBidi": "Arial"
                    },
                    "paragraphFormat": {
                        "afterSpacing": 0.0,
                        "lineSpacing": 1.0,
                        "lineSpacingType": "Multiple",
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "shapeId": 1,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 185.9,
                            "height": 110.6,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#FF0000FF",
                                "weight": 12.5,
                                "lineStyle": "Solid"
                            },
                            "verticalPosition": 29.88,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 18.23,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251660288,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 7.2,
                                "rightMargin": 7.2,
                                "topMargin": 3.6,
                                "bottomMargin": 3.6,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": "[Grab your reader’s attention with a great quote from the document or use this space to emphasize a key point. To place this text box anywhere on the page, just drag it.]"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "shapeId": 217,
                            "name": "Text Box 2",
                            "alternativeText": null,
                            "title": null,
                            "visible": true,
                            "width": 149.04,
                            "height": 46.8,
                            "widthScale": 100.0,
                            "heightScale": 100.0,
                            "lineFormat": {
                                "lineFormatType": "Solid",
                                "color": "#00B0F0FF",
                                "weight": 1.0,
                                "lineStyle": "Solid"
                            },
                            "verticalPosition": 12.07,
                            "verticalOrigin": "Margin",
                            "verticalAlignment": "None",
                            "horizontalPosition": 132.37,
                            "horizontalOrigin": "Margin",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251658240,
                            "allowOverlap": true,
                            "layoutInCell": true,
                            "lockAnchor": false,
                            "autoShapeType": "Rectangle",
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 0.0,
                                "rightMargin": 72.0,
                                "topMargin": 0.0,
                                "bottomMargin": 0.0,
                                "blocks": [
                                    {
                                        "characterFormat": {
                                            "fontSize": 10.0,
                                            "fontFamily": "Arial",
                                            "fontSizeBidi": 10.0,
                                            "fontFamilyBidi": "Arial"
                                        },
                                        "paragraphFormat": {
                                            "styleName": "Normal"
                                        },
                                        "inlines": [
                                            {
                                                "text": " ",
                                                "characterFormat": {
                                                    "fontSize": 10.0,
                                                    "fontFamily": "Arial",
                                                    "fontSizeBidi": 10.0,
                                                    "fontFamilyBidi": "Arial"
                                                }
                                            },
                                            {
                                                "text": "Syncfusion",
                                                "characterFormat": {
                                                    "fontSize": 10.0,
                                                    "fontFamily": "Arial",
                                                    "fontSizeBidi": 10.0,
                                                    "fontFamilyBidi": "Arial"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Action is the foundational key to all success",
                            "characterFormat": {
                                "fontSize": 20.0,
                                "fontFamily": "Arial",
                                "fontSizeBidi": 20.0,
                                "fontFamilyBidi": "Arial"
                            }
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0
            }
        }
    ]
}
describe('Shape Selection Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(shapeSfdt));
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
    it('Floating Elements in paragraph', () => {
console.log('Floating Elements in paragraph');
        let paragraph: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        expect(paragraph.floatingElements.length).toBe(2);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].floatingElements.length).toBe(2);
    });
    it('Check all float Elements', () => {
console.log('Check all float Elements');
        let paragraph: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let line: LineWidget = paragraph.childWidgets[0] as LineWidget
        let shape: ShapeElementBox = paragraph.floatingElements[0] as ShapeElementBox;
        let cursorPoint: Point = new Point(shape.x + 2, shape.y + 10);
        let shapeInfo: ShapeInfo = editor.selection.checkAllFloatingElements(line, cursorPoint);
        expect(shapeInfo.isInShapeBorder).toBe(true);
        cursorPoint = new Point(shape.x + 50, shape.y + 40);
        shapeInfo = editor.selection.checkAllFloatingElements(line, cursorPoint);
        expect(shapeInfo.isInShapeBorder).toBe(false);
        cursorPoint = new Point(shape.x - 20, shape.y + 10);
        shapeInfo = editor.selection.checkAllFloatingElements(line, cursorPoint);
        expect(shapeInfo.isShapeSelected).toBe(false);
    });
    it('Select Shape Pargraph to check shape also selected', () => {
console.log('Select Shape Pargraph to check shape also selected');
        let cursorPoint: Point = new Point(150, 105);
        editor.viewer.documentHelper.updateTextPositionForSelection(cursorPoint, 3);
        let line: LineWidget = editor.selection.start.paragraph.childWidgets[0] as LineWidget;
        expect(line.children[0] instanceof ShapeElementBox).toBe(true);
        expect(line.children[1] instanceof ShapeElementBox).toBe(true);
    });
    it('Check Shape resizer visible for selected shape', () => {
console.log('Check Shape resizer visible for selected shape');
        let paragraph: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let shape: ShapeElementBox = paragraph.floatingElements[0] as ShapeElementBox;
        let cursorPoint: Point = new Point(shape.x + 50, shape.y + 40);
        editor.viewer.documentHelper.updateTextPositionForSelection(cursorPoint, 1);
        expect(editor.selection.isInShape).toBe(true);
        editor.imageResizerModule.updateImageResizerPosition();
        expect(editor.imageResizerModule.isImageResizerVisible).toBe(true);
    });
    it('Editor History inside shape', () => {
console.log('Editor History inside shape');
        let paragraph: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let shape: ShapeElementBox = paragraph.floatingElements[0] as ShapeElementBox;
        let cursorPoint: Point = new Point(shape.x + 50, shape.y + 40);
        editor.viewer.documentHelper.updateTextPositionForSelection(cursorPoint, 1);
        expect(editor.editorHistoryModule.undoStack).toBeUndefined;
        editor.editorModule.insertText('Sync');
        expect(editor.editorHistoryModule.undoStack.length).toBe(1);
        expect(editor.editorHistoryModule.redoStack).toBeUndefined;
        editor.editorHistoryModule.undo();
        expect(editor.editorHistoryModule.redoStack.length).toBe(1);
    });
    it('Editor History on deleting shape', () => {
console.log('Editor History on deleting shape');
        let paragraph: ParagraphWidget = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget;
        let shape: ShapeElementBox = paragraph.floatingElements[0] as ShapeElementBox;
        editor.selectionModule.selectShape(shape);
        let event: any = {
            preventDefault: function () { return true },
            which: 8
        }
        editor.editorModule.onKeyDownInternal(event, false, false, false);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].floatingElements.length).toBe(1);
        editor.editorHistoryModule.undo();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].floatingElements.length).toBe(2);
    });
});

let textInlineSfdt: any = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Name: "
                        },
                        {
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Text1",
                                "enabled": true,
                                "helpText": "",
                                "statusText": "",
                                "textInput": {
                                    "type": "Text",
                                    "maxLength": 0,
                                    "defaultValue": "SYNC",
                                    "format": ""
                                }
                            },
                            "fieldType": 0
                        },
                        {
                            "name": "Text1",
                            "bookmarkType": 0
                        },
                        {
                            "text": " FORMTEXT "
                        },
                        {
                            "fieldType": 2
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        },
                        {
                            "text": "SYNC"
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "name": "Text1",
                            "bookmarkType": 1
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Male: "
                        },
                        {
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Check1",
                                "enabled": false,
                                "helpText": "",
                                "statusText": "",
                                "checkBox": {
                                    "sizeType": "Auto",
                                    "size": 20,
                                    "defaultValue": true,
                                    "checked": true
                                }
                            },
                            "fieldType": 0
                        },
                        {
                            "name": "Check1",
                            "bookmarkType": 0
                        },
                        {
                            "text": " FORMCHECKBOX "
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "name": "Check1",
                            "bookmarkType": 1
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Age: "
                        },
                        {
                            "hasFieldEnd": true,
                            "formFieldData": {
                                "name": "Dropdown1",
                                "enabled": true,
                                "helpText": "",
                                "statusText": "",
                                "dropDownList": {
                                    "dropDownItems": [
                                        "21",
                                        "22",
                                        "23"
                                    ],
                                    "selectedIndex": 0
                                }
                            },
                            "fieldType": 0
                        },
                        {
                            "name": "Dropdown1",
                            "bookmarkType": 0
                        },
                        {
                            "text": " FORMDROPDOWN "
                        },
                        {
                            "fieldType": 1
                        },
                        {
                            "name": "Dropdown1",
                            "bookmarkType": 1
                        }
                    ]
                }
            ],
            "headersFooters": {},
            "sectionFormat": {
                "headerDistance": 36.0,
                "footerDistance": 36.0,
                "pageWidth": 612.0,
                "pageHeight": 792.0,
                "leftMargin": 72.0,
                "rightMargin": 72.0,
                "topMargin": 72.0,
                "bottomMargin": 72.0,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "bidi": false,
                "restartPageNumbering": false,
                "pageStartingNumber": 0
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "FormFieldsOnly",
    "enforcement": true,
    "dontUseHTMLParagraphAutoSpacing": false
}

describe('Text form field Inline validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({
            height: '500px', enableEditor: true, enableSelection: true, acceptTab: true,
            documentEditorSettings: { formFieldSettings: { formFillingMode: 'Inline' } }
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
        documentHelper = editor.documentHelper;        
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
    it('Navigate to next form field on Mouse Up', () => {
console.log('Navigate to next form field on Mouse Up');
        editor.open(JSON.stringify(textInlineSfdt));
        let formFields: FieldElementBox[] = documentHelper.formFields;
        let currentFormField: FieldElementBox = editor.selection.getCurrentFormField();
        expect(currentFormField).toBeUndefined;
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: 145,
            offsetY: 125,
            ctrlKey: false,
            which: 1
        };
        documentHelper.isMouseDown = true;
        documentHelper.onMouseUpInternal(event);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);

        event.offsetX = 260;
        documentHelper.onMouseUpInternal(event);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);

        event.offsetX = 260;
        event.offsetY = 300;
        documentHelper.onMouseUpInternal(event);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);
    });
    it('arrow Key navigation form fields Validation', () => {
console.log('arrow Key navigation form fields Validation');
        editor.open(JSON.stringify(textInlineSfdt));
        let formFields: FieldElementBox[] = documentHelper.formFields;
        let currentFormField: FieldElementBox = editor.selection.getCurrentFormField();
        expect(currentFormField).toBeUndefined;
        let keyEvent: any = {
            keyCode: 40,
            preventDefault: () => { return true; }
        }
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[2]);
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);

        keyEvent.keyCode = 38;
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[2]);
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);
    });
    it('Tab & shift Key navigation form fields Validation', () => {
console.log('Tab & shift Key navigation form fields Validation');
        editor.open(JSON.stringify(textInlineSfdt));
        let formFields: FieldElementBox[] = documentHelper.formFields;
        let currentFormField: FieldElementBox = editor.selection.getCurrentFormField();
        expect(currentFormField).toBeUndefined;
        let keyEvent: any = {
            keyCode: 9,
            preventDefault: () => { return true; }
        }
        editor.editorModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);
        editor.editorModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[2]);
        editor.editorModule.onKeyDownInternal(keyEvent, false, false, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);

        editor.editorModule.onKeyDownInternal(keyEvent, false, true, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[2]);
        editor.editorModule.onKeyDownInternal(keyEvent, false, true, false);
        currentFormField = editor.selection.getCurrentFormField();
        expect(currentFormField).toBe(formFields[0]);
    });
});

describe('Track changes Enabled deletion', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({
            height: '500px', enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true
        });
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
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Bulleted deletion', () => {
console.log('Bulleted deletion');
        editor.openBlank();
        editor.editorModule.insertText('Sync');
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        editor.enableTrackChanges = true;
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        editor.editorModule.onBackSpace();
        let range: Object[] = editor.revisions.changes[0].range;
        expect((range[0] as TextElementBox).text).toBe('S');
        expect((range[1] as TextElementBox).text).toBe('y');
        expect((range[2] as TextElementBox).text).toBe('n');
        expect((range[3] as TextElementBox).text).toBe('c');
        let elementBox: ElementBox[] = ((documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children;
        expect((elementBox[2] as TextElementBox).text).toBe('S');
        expect((elementBox[3] as TextElementBox).text).toBe('y');
        expect((elementBox[4] as TextElementBox).text).toBe('n');
        expect((elementBox[5] as TextElementBox).text).toBe('c');
    });
});
let file : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":85.05000305175781,"rightMargin":85.05000305175781,"topMargin":70.8499984741211,"bottomMargin":70.8499984741211,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":35.400001525878906,"footerDistance":35.400001525878906,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":10,"styleName":"Strong","fontSizeBidi":10},"text":"Señores"},{"characterFormat":{"fontSize":10,"fontSizeBidi":10},"text":","}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u000b"},{"characterFormat":{"fontSize":10,"styleName":"Strong","fontSizeBidi":10},"text":"XXXXXXXXXXXXXXX"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{"fontSize":10,"styleName":"Strong","fontSizeBidi":10},"text":"XXXXXXXXXXXXXXX"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":" "}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":" "}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Justify","styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":10,"fontSizeBidi":10},"text":"XXXXXXXXXXX,"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Justify","styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":10,"fontSizeBidi":10},"text":". "}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Justify","styleName":"Normal (Web)","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"inlines":[{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":" "}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Justify","styleName":"Normal (Web)","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"inlines":[{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"testtest"},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"J.  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"  "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":" "},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"testtset"},{"characterFormat":{"fontSize":9,"fontFamily":"Bookman Old Style","styleName":"Strong","fontSizeBidi":9,"fontFamilyBidi":"Bookman Old Style"},"text":"J."}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":" "}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Center","styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":10,"fontSizeBidi":10},"text":"C"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal (Web)","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":" "}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":35.400001525878906,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Normal (Web)","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":5,"afterSpacing":5,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12,"fontFamilyBidi":"Times New Roman"},"basedOn":"Normal","next":"Normal (Web)"},{"name":"Strong","type":"Character","characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}
describe('Select all content and changes the font family', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = "";
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1000px;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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
        viewer = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Select all content and changes the font family', () => {
        console.log('Select all content and changes the font family');
        editor.openBlank();
        editor.open(file);
        editor.selection.selectAll();
        expect(editor.selection.characterFormat.fontFamily).toBe(undefined);
        editor.selection.characterFormat.fontFamily = "Times New Roman";
        expect(editor.selection.characterFormat.fontFamily).toBe("Times New Roman");
    });
});
describe('Inside shape selection validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
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
    it('Inside shape selection validation', () => {
        console.log('Inside shape selection validation');
        let text: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false, "pageNumberStyle": "Arabic" }, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "shapeId": 1, "name": "Rectangle 1", "visible": true, "width": 416, "height": 161.5, "widthScale": 100, "heightScale": 100, "verticalPosition": 5.5, "verticalOrigin": "Paragraph", "verticalAlignment": "None", "verticalRelativePercent": -3.4028235e+38, "horizontalPosition": 2, "horizontalOrigin": "Column", "horizontalAlignment": "None", "horizontalRelativePercent": -3.4028235e+38, "zOrderPosition": 251659264, "allowOverlap": true, "textWrappingStyle": "Square", "textWrappingType": "Both", "distanceBottom": 0, "distanceLeft": 9, "distanceRight": 9, "distanceTop": 0, "layoutInCell": true, "lockAnchor": false, "autoShapeType": "Rectangle", "fillFormat": { "color": "#4472C4FF", "fill": true }, "lineFormat": { "lineFormatType": "Solid", "color": "#2F528FFF", "weight": 1, "lineStyle": "Solid", "line": true }, "textFrame": { "textVerticalAlignment": "Middle", "leftMargin": 7.2, "rightMargin": 7.2, "topMargin": 3.6, "bottomMargin": 3.6, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "test" }] }] } }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "shapeId": 6, "name": "Rectangle 6", "visible": true, "width": 205, "height": 95, "widthScale": 100, "heightScale": 100, "verticalPosition": 0.55, "verticalOrigin": "Paragraph", "verticalAlignment": "None", "verticalRelativePercent": -3.4028235e+38, "horizontalPosition": 114, "horizontalOrigin": "Margin", "horizontalAlignment": "None", "horizontalRelativePercent": -3.4028235e+38, "zOrderPosition": 251660288, "allowOverlap": true, "textWrappingStyle": "InFrontOfText", "textWrappingType": "Both", "distanceBottom": 0, "distanceLeft": 9, "distanceRight": 9, "distanceTop": 0, "layoutInCell": true, "lockAnchor": false, "autoShapeType": "Rectangle", "fillFormat": { "color": "#4472C4FF", "fill": true }, "lineFormat": { "lineFormatType": "Solid", "color": "#2F528FFF", "weight": 1, "lineStyle": "Solid", "line": true }, "textFrame": { "textVerticalAlignment": "Middle", "leftMargin": 7.2, "rightMargin": 7.2, "topMargin": 3.6, "bottomMargin": 3.6, "blocks": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "textAlignment": "Center", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "hello" }] }] } }] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {}, "tabs": [{ "position": 84.5, "deletePosition": 0, "tabJustification": "Left", "tabLeader": "None" }] }, "characterFormat": {}, "inlines": [] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#00000000", "boldBidi": false, "italicBidi": false, "fontSizeBidi": 11, "fontFamilyBidi": "Calibri", "allCaps": false, "localeIdBidi": 1025 }, "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false, "keepLinesTogether": false, "keepWithNext": false, "widowControl": true }, "defaultTabWidth": 36, "trackChanges": false, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "formFieldShading": true, "compatibilityMode": "Word2013", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 16, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontSizeBidi": 13, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontSizeBidi": 12, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496", "italicBidi": true, "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763", "fontFamilyBidi": "Calibri Light" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [], "revisions": [], "customXml": [], "footnotes": { "separator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "endnotes": { "separator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0003" }] }], "continuationSeparator": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "\u0004" }] }], "continuationNotice": [{ "paragraphFormat": { "borders": { "top": {}, "left": {}, "right": {}, "bottom": {}, "horizontal": {}, "vertical": {} }, "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } };
        editor.openBlank();
        editor.open(JSON.stringify(text));
        let cursorPoint: Point = new Point(452, 274);
        editor.viewer.documentHelper.updateTextPositionForSelection(cursorPoint, 1);
        expect(((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('hello');
    });
});
describe('Select bookmark in backward', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
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
    it('Select bookmark in backward', () => {
        console.log('Select bookmark in backward');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion');
        editor.editorModule.onEnter();
        editor.editorModule.insertBookmark('b1');
        editor.selection.handleShiftUpKey();
        expect(((editor.selection.end.paragraph.childWidgets[0] as LineWidget).children[0] as TextElementBox).text).toBe('Syncfusion');
    });
});
let content: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"preferredWidthType":"Point","cellWidth":156,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridAfter":0,"gridAfterWidth":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"h"},{"characterFormat":{"bidi":false},"text":"e"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"f"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"bidi":false},"inlines":[{"characterFormat":{"bidi":false},"text":"fhello"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"preferredWidthType":"Point","cellWidth":156,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridAfter":0,"gridAfterWidth":0}},{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"preferredWidthType":"Point","cellWidth":156,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"bidi":false},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"preferredWidthType":"Point","cellWidth":156,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"firstLineIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{"bidi":false},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"book1"},{"characterFormat":{"bidi":false},"text":"h"},{"characterFormat":{},"bookmarkType":1,"name":"book1"},{"characterFormat":{"bidi":false},"text":"l"},{"characterFormat":{"bidi":false},"text":"l"},{"characterFormat":{"bidi":false},"text":"o"}]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"preferredWidthType":"Point","cellWidth":156,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}}],"grid":[156,156,156],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":3},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]};
describe('Bookmark selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
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
    it('Selection location', () => {
        console.log('Selection location');
        editor.openBlank();
        editor.open(content);
        editor.selection.select('0;2;2;2;0;1','0;2;2;2;0;1');
        expect(editor.selection.start.location.x).toBeLessThan(525);
    });
    it('Goto Bookmark', () => {
        console.log('Goto Bookmark');
        editor.openBlank();
        editor.editorModule.insertText('Hello');
        editor.selection.select('0;0;0','0;0;1');
        editor.editorModule.insertBookmark('a1');
        editor.selection.selectBookmark('a1');
        expect(editor.selection.endOffset).toBe('0;0;3')
        expect(editor.selection.end.location.x).toBeLessThan(107);
    });
    it('Select bookmark and insert text', () => {
        console.log('Select bookmark and insert text');
        editor.openBlank();
        editor.editorModule.insertText('Hello');
        editor.selection.select('0;0;0','0;0;5');
        editor.editorModule.insertBookmark('a1');
        expect(((editor.selection.start.paragraph.childWidgets[0] as LineWidget).children[1] as TextElementBox).text).toBe('Hello');
        expect(editor.selection.startOffset).toBe('0;0;1');
        expect(editor.selection.endOffset).toBe('0;0;6');
        expect(editor.selection.start.location.x).toBeLessThan(100);
    });
});
let para: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"firstLineIndent":0,"afterSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"inlines":[{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"In 2000, Adventure Works Cycles bought a small manufacturing plant, "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Importadores"},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":" "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Neptuno, "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"located in Mexico. "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Importadores"},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":" Neptuno manufactures several critical "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"subcomponents"},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":" for the "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Adventure Works Cycles product line. These subcomponents are "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"shipped to the Bothell location "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"for final product assembly. In 2001, "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Importadores"},{"characterFormat":{},"text":" "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"Neptuno, "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"became the sole manufacturer and "},{"characterFormat":{"fontSize":12,"fontColor":"empty","fontSizeBidi":12},"text":"distributor of the touring bicycle product group."}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":true,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":8,"lineSpacing":1.149999976158142,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontFamily":"Calibri","fontColor":"empty","fontFamilyBidi":"Calibri"},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":12,"afterSpacing":0,"outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2E74B5FF","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","next":"Normal"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Header","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":234,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{"fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{"fontColor":"empty"},"basedOn":"Normal","next":"List Paragraph"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Shift + Down arrow selection validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
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
    it('Shift + Down arrow selection validation', () => {
        console.log('Shift + Down arrow selection validation');
        editor.openBlank();
        editor.open(para);
        editor.selection.handleShiftDownKey();
        expect(editor.selection.endOffset).toBe('0;0;90')
    });
});

describe('To check form field selection', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
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
    let sfdt : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":36,"rightMargin":36,"topMargin":70,"bottomMargin":50,"differentFirstPage":true,"differentOddAndEvenPages":false,"headerDistance":35,"footerDistance":30,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"lineSpacing":1.1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":0,"leftMargin":36,"bottomMargin":0,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":0,"rightMargin":36,"bottomMargin":0,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}}],"grid":[270,270],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0},"left":{"lineStyle":"Single","lineWidth":0},"right":{"lineStyle":"Single","lineWidth":0},"bottom":{"lineStyle":"Single","lineWidth":0},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0},"vertical":{"lineStyle":"Single","lineWidth":0}},"shading":{},"cellSpacing":0,"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":0,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":true},"columnCount":2},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"fontSize":19,"fontColor":"#132B7B","boldBidi":true,"fontSizeBidi":19},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"83eaa970-38c6-4fe2-8953-3dc90ef4f6b0","enabled":true,"helpText":"$__realestate_name__$","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"$__realestate_name__$","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"83eaa970-38c6-4fe2-8953-3dc90ef4f6b0"},{"characterFormat":{"bold":true,"fontSize":19,"fontColor":"#132B7B","boldBidi":true,"fontSizeBidi":19},"text":"FORMTEXT"},{"characterFormat":{"bold":true,"fontSize":19,"fontColor":"#132B7B","boldBidi":true,"fontSizeBidi":19},"fieldType":2},{"characterFormat":{"bold":true,"fontSize":19,"fontColor":"#132B7B","bidi":false,"boldBidi":true,"fontSizeBidi":19},"text":"$__realestate_name__$"},{"characterFormat":{"bold":true,"fontSize":19,"fontColor":"#132B7B","boldBidi":true,"fontSizeBidi":19},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"83eaa970-38c6-4fe2-8953-3dc90ef4f6b0"}]},{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":19,"fontColor":"#132B7B","fontSizeBidi":19},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"29f70a0d-6cdb-40c9-90bb-0872ddd5f38a","enabled":true,"helpText":"$__address_repr__$","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"$__address_repr__$","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"29f70a0d-6cdb-40c9-90bb-0872ddd5f38a"},{"characterFormat":{"fontSize":19,"fontColor":"#132B7B","fontSizeBidi":19},"text":"FORMTEXT"},{"characterFormat":{"fontSize":19,"fontColor":"#132B7B","fontSizeBidi":19},"fieldType":2},{"characterFormat":{"fontSize":19,"fontColor":"#132B7B","fontSizeBidi":19},"text":"$__address_repr__$"},{"characterFormat":{"fontSize":19,"fontColor":"#132B7B","fontSizeBidi":19},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"29f70a0d-6cdb-40c9-90bb-0872ddd5f38a"}]}],"headersFooters":{"header":{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":""}]}],"cellFormat":{"borders":{"top":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#BFC5E1","lineStyle":"Single","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":0,"bottomMargin":2,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Right","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"fontSize":7,"fontColor":"#011A66","bidi":false,"boldBidi":true,"fontSizeBidi":7},"text":"Pre-Underwriting Report"}]}],"cellFormat":{"borders":{"top":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#BFC5E1","lineStyle":"Single","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":0,"bottomMargin":2,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}}],"grid":[],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0},"left":{"lineStyle":"Single","lineWidth":0},"right":{"lineStyle":"Single","lineWidth":0},"bottom":{"lineStyle":"Single","lineWidth":0},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0},"vertical":{"lineStyle":"Single","lineWidth":0}},"shading":{},"cellSpacing":0,"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":0,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":true},"columnCount":0}]},"footer":{"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"imageString":"data:image/png;base64,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","isMetaFile":false,"isCompressed":false,"width":101,"height":20,"iscrop":false,"name":"","alternativeText":"","title":"","verticalPosition":0,"horizontalPosition":0,"textWrappingStyle":"Inline"}]}],"cellFormat":{"borders":{"top":{"color":"#BFC5E1","lineStyle":"Single","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":5,"bottomMargin":0,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"textAlignment":"Right","styleName":"Normal","listFormat":{}},"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"inlines":[{"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"text":" PAGE   \\* MERGEFORMAT "},{"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"fieldType":2},{"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"text":""},{"characterFormat":{"fontSize":10,"fontFamily":"Arial","fontColor":"#717171","fontSizeBidi":10,"fontFamilyBidi":"Arial","allCaps":false},"fieldType":1}]}],"cellFormat":{"borders":{"top":{"color":"#BFC5E1","lineStyle":"Single","lineWidth":1},"left":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"right":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"bottom":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"diagonalDown":{},"diagonalUp":{},"horizontal":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1},"vertical":{"color":"#ffffff","lineStyle":"Cleared","lineWidth":1}},"shading":{},"topMargin":5,"bottomMargin":0,"preferredWidth":50,"preferredWidthType":"Percent","cellWidth":270,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0}}],"grid":[],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0},"left":{"lineStyle":"Single","lineWidth":0},"right":{"lineStyle":"Single","lineWidth":0},"bottom":{"lineStyle":"Single","lineWidth":0},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0},"vertical":{"lineStyle":"Single","lineWidth":0}},"shading":{},"cellSpacing":0,"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":0,"leftMargin":0,"bottomMargin":0,"preferredWidth":0,"preferredWidthType":"Percent","bidi":false,"allowAutoFit":true},"columnCount":0}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":9,"fontFamily":"Arial","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#4A4A4A","boldBidi":false,"italicBidi":false,"fontSizeBidi":9,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1.2,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"lineSpacing":1.1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":15,"afterSpacing":0,"lineSpacing":1.1,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Arial","fontColor":"#003366","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"bold":true,"fontSize":16,"fontFamily":"Arial","fontColor":"#003366","boldBidi":true,"fontSizeBidi":16,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":10,"lineSpacing":1.1,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"bold":true,"fontSize":14,"fontFamily":"Arial","fontColor":"#011A66","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"bold":true,"fontSize":14,"fontFamily":"Arial","fontColor":"#011A66","boldBidi":true,"fontSizeBidi":14,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":7,"afterSpacing":7,"lineSpacing":1.1,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#4A4A4A","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"fontFamily":"Arial","fontColor":"#4A4A4A","boldBidi":true,"fontSizeBidi":10,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":10,"afterSpacing":0,"lineSpacing":1.1,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","fontColor":"#000000","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","fontColor":"#000000","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.1,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#003366","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Arial","fontColor":"#003366","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":40,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":15,"lineSpacing":1.2,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}
    it('To check entire formfield not to be selected while clicking at the form field end', () => {
        console.log('To check entire formfield not to be selected while clicking at the form field end');
        editor.openBlank();
        editor.open(sfdt);
        let event: any = {
            offsetX: 530,
            offsetY: 149,
            preventDefault: () => { return true; },
            ctrlKey: false,
            which: 1
        };
        editor.documentHelper.isMouseDown = true;
        editor.documentHelper.onMouseUpInternal(event);
        expect(editor.selection.startOffset).toBe('0;1;34');
        expect(editor.selection.endOffset).toBe('0;1;34');
    });
});

describe('To check editing working properly in form field', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ImageResizer, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.documentEditorSettings.formFieldSettings.formFillingMode = 'Inline';
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
    let sfdt : any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"Text1"},{"characterFormat":{},"text":"FORMTEXT"},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"     "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":1,"name":"Text1"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":true,"hashValue":"","saltValue":"","formatting":false,"protectionType":"FormFieldsOnly","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"horizontal":{},"vertical":{}},"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]}
    it('To check editing working properly inside separated form field', () => {
        console.log('To check editing working properly inside separated form field');
        editor.openBlank();
        editor.open(sfdt);
        editor.selection.moveNextPosition();
        editor.editor.insertText('Hello');
        editor.editor.onEnter();
        editor.editor.insertText('World');
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToPreviousParagraph();
        editor.selection.moveToParagraphEnd();
        editor.editor.insertText(' editor');
        let formField : FieldElementBox = editor.selection.getCurrentFormField();
        let resulText : string = editor.editor.getFieldResultText(formField);
        expect(resulText).toBe('Hello editor\rWorld');
    });
});