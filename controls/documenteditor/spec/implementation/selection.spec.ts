import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Selection, DocumentHelper, ShapeElementBox, ImageResizer } from '../../src/index';
import {
    SelectionWidgetInfo, TextPosition
} from '../../src/index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Point, ShapeInfo } from '../../src/document-editor/implementation/editor/editor-helper';
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
