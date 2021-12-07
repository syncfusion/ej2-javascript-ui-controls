import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, Editor, Selection, EditorHistory, Page, ParagraphWidget, DocumentHelper, FieldElementBox, TextElementBox, SfdtExport } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
/**
 * Layout Spec
 */
function getJson() {
    let rowSplit: any = {
        "sections": [
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": []
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": []
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": []
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 16,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
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
                                                                                                "characterFormat": {
                                                                                                    "bold": false,
                                                                                                    "italic": false,
                                                                                                    "strikethrough": "None",
                                                                                                    "baselineAlignment": "Normal",
                                                                                                    "fontSize": 14.5,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
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
                                                                                                    "fontSize": 14.5,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "AdventureWorks",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "American",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF806000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": ", European and Asian commercial markets. While its base operation ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "is located in",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "base",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "Adventure",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Works Cycles",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
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
                                                                                                    "fontSize": 14.5,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "AdventureWorks",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " sample databases are based, is a large, multinational manufacturing company. The company ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "manufactures and sells metal and composite bicycles to North ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "American",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF806000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": ", European and Asian commercial markets. While its base operation ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "is located in",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "base",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "Adventure",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Works Cycles",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
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
                                                                                                    "fontSize": 14.5,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "AdventureWorks",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "American",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF806000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": ", European and Asian commercial markets. While its base operation ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "is located in",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "market ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "base",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "Adventure",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Works Cycles",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
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
                                                                                                    "fontSize": 14.5,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "AdventureWorks",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "American",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF806000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": ", European and Asian commercial markets. While its base operation ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "is located in",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "base",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "Adventure",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " Works Cycles",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 24,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF2E74B5"
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
                                                                                                    "fontSize": 16,
                                                                                                    "fontFamily": "Calibri",
                                                                                                    "fontColor": "#FF000000"
                                                                                                },
                                                                                                "paragraphFormat": {
                                                                                                    "leftIndent": 0,
                                                                                                    "rightIndent": 0,
                                                                                                    "firstLineIndent": 0,
                                                                                                    "beforeSpacing": 24,
                                                                                                    "afterSpacing": 40,
                                                                                                    "lineSpacing": 1,
                                                                                                    "lineSpacingType": "Multiple",
                                                                                                    "textAlignment": "Left"
                                                                                                },
                                                                                                "inlines": [
                                                                                                    {
                                                                                                        "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "AdventureWorks",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "and composite bicycles to North ",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": "American",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF806000"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        "text": ", European and Asian commercial markets. While its base operation is located in Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base",
                                                                                                        "characterFormat": {
                                                                                                            "bold": false,
                                                                                                            "italic": false,
                                                                                                            "strikethrough": "None",
                                                                                                            "baselineAlignment": "Normal",
                                                                                                            "fontSize": 16,
                                                                                                            "fontFamily": "Calibri",
                                                                                                            "fontColor": "#FF000000"
                                                                                                        }
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ],
                                                                                        "cellFormat": {
                                                                                            "cellWidth": 216.8000030517578,
                                                                                            "columnSpan": 1,
                                                                                            "rowSpan": 1,
                                                                                            "preferredWidth": 216.8000030517578,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 24,
                                                                            "afterSpacing": 40,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "Adventure",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Works Cycles",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 24,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF2E74B5"
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
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": [
                                                                            {
                                                                                "text": "Adventure Works Cycles, the fictitious company on which the ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "AdventureWorks",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "American",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF806000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": ", European and Asian commercial markets. While its base operation ",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": "is located in",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            },
                                                                            {
                                                                                "text": " Bothell, Washington with 290 employees, several regional sales teams are located throughout their market base",
                                                                                "characterFormat": {
                                                                                    "bold": false,
                                                                                    "italic": false,
                                                                                    "strikethrough": "None",
                                                                                    "baselineAlignment": "Normal",
                                                                                    "fontSize": 16,
                                                                                    "fontFamily": "Calibri",
                                                                                    "fontColor": "#FF000000"
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                                        "characterFormat": {
                                                                            "bold": false,
                                                                            "italic": false,
                                                                            "strikethrough": "None",
                                                                            "baselineAlignment": "Normal",
                                                                            "fontSize": 14.5,
                                                                            "fontFamily": "Calibri",
                                                                            "fontColor": "#FF000000"
                                                                        },
                                                                        "paragraphFormat": {
                                                                            "leftIndent": 0,
                                                                            "rightIndent": 0,
                                                                            "firstLineIndent": 0,
                                                                            "beforeSpacing": 0,
                                                                            "afterSpacing": 0,
                                                                            "lineSpacing": 1,
                                                                            "lineSpacingType": "Multiple",
                                                                            "textAlignment": "Left"
                                                                        },
                                                                        "inlines": []
                                                                    }
                                                                ],
                                                                "cellFormat": {
                                                                    "cellWidth": 228.10000610351562,
                                                                    "columnSpan": 1,
                                                                    "rowSpan": 1,
                                                                    "preferredWidth": 228.10000610351562,
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
                                                "characterFormat": {
                                                    "bold": false,
                                                    "italic": false,
                                                    "strikethrough": "None",
                                                    "baselineAlignment": "Normal",
                                                    "fontSize": 14.5,
                                                    "fontFamily": "Calibri",
                                                    "fontColor": "#FF000000"
                                                },
                                                "paragraphFormat": {
                                                    "leftIndent": 0,
                                                    "rightIndent": 0,
                                                    "firstLineIndent": 0,
                                                    "beforeSpacing": 0,
                                                    "afterSpacing": 0,
                                                    "lineSpacing": 1,
                                                    "lineSpacingType": "Multiple",
                                                    "textAlignment": "Left"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 467.5,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 467.5,
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
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 14.5,
                            "fontFamily": "Calibri",
                            "fontColor": "#FF000000"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 8,
                            "lineSpacing": 1.0791666507720947,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
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
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "baselineAlignment": "Normal",
            "fontSize": 11,
            "fontFamily": "Calibri"
        }
    };
    return JSON.stringify(rowSplit);
}

// describe('Document Layout behaviour validation', () => {
//     let editor: DocumentEditor = undefined;
//     let viewer: LayoutViewer;
//     beforeAll(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({});
//         viewer = editor.documentHelper as PageLayoutViewer;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             done();
//         }, 750);
//     });
//     it('break character validation', () => {
//         expect(() => { editor.open(getJson()) }).not.toThrowError();
//     });
// });

describe('Page Break Layout Validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Layout page break', () => {
console.log('Layout page break');
        editor.open(JSON.stringify(sfdt));
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Insert Text Before Page Break', () => {
console.log('Insert Text Before Page Break');
        editor.editorModule.insertText('Syncfusion');
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(0);
    });
    it('Insert Text after page break', () => {
console.log('Insert Text after page break');
        editor.selection.moveToLineEnd();
        editor.editorModule.insertText('Syncfusion');
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(1);
    });
    it('Handle Shifting after page break validation', () => {
console.log('Handle Shifting after page break validation');
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.selection.moveToLineStart();
        for (let i: number = 0; i < 60; i++) {
            editor.editor.onEnter();
        }
        expect(editor.documentHelper.pages.length).toBe(3);
    });
    it('Handle Shifting after page break validation backward', () => {
console.log('Handle Shifting after page break validation backward');
        for (let i: number = 0; i < 20; i++) {
            editor.editor.onBackSpace();
        }
        expect(editor.documentHelper.pages.length).toBe(2);
    });
});

describe('Insert Page break API validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Ctrl + Enter key validation', () => {
console.log('Ctrl + Enter key validation');
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Insert Text Before Page Break', () => {
console.log('Insert Text Before Page Break');
        editor.editorModule.insertText('Syncfusion');
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(1);
    });
});
describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Insert Page break at paragraph start', () => {
console.log('Insert Page break at paragraph start');
        editor.editor.insertText('Syncfusion Software');
        editor.selection.moveToLineStart();
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Undo Redo multiple times', () => {
console.log('Undo Redo multiple times');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.documentHelper.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.documentHelper.pages.length).toBe(2);
        }
    });
});

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Insert Page break at paragraph end', () => {
console.log('Insert Page break at paragraph end');
        editor.editor.insertText('Syncfusion Software');
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Undo Redo multiple times at paragraph end', () => {
console.log('Undo Redo multiple times at paragraph end');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.documentHelper.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.documentHelper.pages.length).toBe(2);
        }
    });
});

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Insert Page break at paragraph middle', () => {
console.log('Insert Page break at paragraph middle');
        editor.editor.insertText('Syncfusion Software');
        editor.selection.movePreviousPosition();
        editor.selection.movePreviousPosition();
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.documentHelper.pages.length).toBe(2);
    });
    it('Undo Redo multiple times at paragraph middle', () => {
console.log('Undo Redo multiple times at paragraph middle');
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.documentHelper.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.documentHelper.pages.length).toBe(2);
        }
    });
});

let sfdt: object = {
    'sections': [
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': false,
                                'italic': false
                            },
                            'text': '\f'
                        }
                    ]
                }, {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': false,
                                'italic': false
                            },
                            'text': 'Syncfusion'
                        }
                    ]
                }
            ],
            'headersFooters': {
            }
        }
    ]
};

let crossRefSfdt: object = {
    "sections": [
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
                            "text": " REF Syncfusion \\h "
                        },
                        {
                            "fieldType": 2
                        },
                        {
                            "text": "Syncfusion"
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
                            "name": "Syncfusion",
                            "bookmarkType": 0
                        },
                        {
                            "text": "Sync"
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 0
                        },
                        {
                            "name": "Syncfusion",
                            "bookmarkType": 1
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
    ],
    "characterFormat": {
        "fontSize": 11.0,
        "fontFamily": "Calibri",
        "fontSizeBidi": 11.0,
        "fontFamilyBidi": "Arial"
    },
    "paragraphFormat": {
        "afterSpacing": 8.0,
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
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false
}

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Insert Page break at paragraph middle', () => {
console.log('Insert Page break at paragraph middle');
        editor.editor.insertText('Syncfusion Software');
        editor.editor.onEnter();
        editor.editor.insertText('Syncfusion Software');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.editor.insertPageBreak();
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(2);
        editor.editorHistory.redo();
        expect(editor.documentHelper.pages.length).toBe(2);
    });
//     it('Insert Page Break on non empty selection', () => {
// console.log('Insert Page Break on non empty selection');
//         editor.openBlank();
//         editor.editor.insertText('Syncfusion Software');
//         editor.editor.onEnter();
//         editor.editor.insertText('Syncfusion Software');
//         editor.editor.onEnter();
//         editor.editor.insertText('Syncfusion Software');
//         editor.selection.selectPosition(editor.documentStart, editor.documentStart);
//         editor.selection.moveNextPosition();
//         editor.selection.moveNextPosition();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.selection.handleShiftRightKey();
//         editor.editor.insertPageBreak();
//         editor.editorHistory.undo();
//         expect(editor.documentHelper.pages.length).toBe(1);
//         editor.editorHistory.redo();
//         expect(editor.documentHelper.pages.length).toBe(2);
//     });
});

let documentWithoutHeaderFooter: any = {
    "sections": [
        {
            "sectionFormat": {
                "pageWidth": 612,
                "pageHeight": 792,
                "leftMargin": 10,
                "rightMargin": 10,
                "topMargin": 10,
                "bottomMargin": 10,
                "differentFirstPage": false,
                "differentOddAndEvenPages": false,
                "headerDistance": 36,
                "footerDistance": 36,
                "bidi": false
            },
            "blocks": [
                {
                    "paragraphFormat": {
                        "listFormat": {}
                    },
                    "characterFormat": {},
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": true
                            },
                            "text": "Hello World"
                        }
                    ]
                }
            ],
            "headersFooters": {}
        }
    ]
};

describe('Empty Header footer validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('Load empty header footer validation', () => {
console.log('Load empty header footer validation');
        editor.open(JSON.stringify(documentWithoutHeaderFooter));
        expect(editor.documentHelper.pages.length).toBe(1);
        let page: Page = editor.documentHelper.pages[0];
        expect(page.headerWidget.isEmpty).toBe(true);
        expect((page.bodyWidgets[0].firstChild as ParagraphWidget).y).toBeLessThan(page.headerWidget.y + page.headerWidget.height);
    });
    it('Go to header', () => {
console.log('Go to header');
        editor.selection.goToHeader();
        let page: Page = editor.documentHelper.pages[0];
        expect((page.bodyWidgets[0].firstChild as ParagraphWidget).y).toBe(page.headerWidget.y + page.headerWidget.height);
        editor.selection.disableHeaderFooter();
        expect((page.bodyWidgets[0].firstChild as ParagraphWidget).y).toBeLessThan(page.headerWidget.y + page.headerWidget.height);
    });
    it('insert text in Empty Header', () => {
console.log('insert text in Empty Header');
        editor.selection.goToHeader();
        editor.editor.insertText("Syncfusion");
        let page: Page = editor.documentHelper.pages[0];
        expect(page.headerWidget.isEmpty).toBe(false);
        expect((page.bodyWidgets[0].firstChild as ParagraphWidget).y).toBe(page.headerWidget.y + page.headerWidget.height);
        editor.selection.disableHeaderFooter();
        expect((page.bodyWidgets[0].firstChild as ParagraphWidget).y).toBe(page.headerWidget.y + page.headerWidget.height);
    });
});

describe('F9 key press Validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, SfdtExport);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        documentHelper = editor.documentHelper;
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
        }, 750);
    });
    it('F9 key press', () => {
console.log('F9 key press');
        editor.open(JSON.stringify(crossRefSfdt));
        let field: FieldElementBox =  editor.documentHelper.fields[0];
        let textElement: TextElementBox = field.line.children[3] as TextElementBox;
        expect(textElement.text).toBe('Syncfusion');
        let event: any = {
            preventDefault: function () { return false },
            which: 120
        }
        editor.selection.moveToNextCharacter();
        editor.editor.onKeyDownInternal(event, false, false, false);
        expect((field.line.children[3] as TextElementBox).text).toBe('Sync');
    });
});
