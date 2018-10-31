import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, Editor, Selection, EditorHistory } from '../../src/index';
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
//         viewer = editor.viewer as PageLayoutViewer;
//         (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(function () {
//             done();
//         }, 1000);
//     });
//     it('break character validation', () => {
//         expect(() => { editor.open(getJson()) }).not.toThrowError();
//     });
// });

describe('Page Break Layout Validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Layout page break', () => {
        editor.open(JSON.stringify(sfdt));
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Insert Text Before Page Break', () => {
        editor.editorModule.insertText('Syncfusion', false);
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(0);
    });
    it('Insert Text after page break', () => {
        editor.selection.moveToLineEnd();
        editor.editorModule.insertText('Syncfusion', false);
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(1);
    });
    it('Handle Shifting after page break validation', () => {
        editor.selection.moveUp();
        editor.selection.moveUp();
        editor.selection.moveToLineStart();
        for (let i: number = 0; i < 60; i++) {
            editor.editor.onEnter();
        }
        expect(editor.viewer.pages.length).toBe(3);
    });
    it('Handle Shifting after page break validation backward', () => {
        for (let i: number = 0; i < 20; i++) {
            editor.editor.onBackSpace();
        }
        expect(editor.viewer.pages.length).toBe(2);
    });
});

describe('Insert Page break API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Ctrl + Enter key validation', () => {
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Insert Text Before Page Break', () => {
        editor.editorModule.insertText('Syncfusion', false);
        expect(editor.selection.start.paragraph.bodyWidget.page.index).toBe(1);
    });
});
describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert Page break at paragraph start', () => {
        editor.editor.insertText('Syncfusion Software', false);
        editor.selection.moveToLineStart();
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Undo Redo multiple times', () => {
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.viewer.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.viewer.pages.length).toBe(2);
        }
    });
});

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert Page break at paragraph end', () => {
        editor.editor.insertText('Syncfusion Software', false);
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Undo Redo multiple times at paragraph end', () => {
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.viewer.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.viewer.pages.length).toBe(2);
        }
    });
});

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert Page break at paragraph middle', () => {
        editor.editor.insertText('Syncfusion Software', false);
        editor.selection.movePreviousPosition();
        editor.selection.movePreviousPosition();
        let event: any = {
            preventDefault: function () { return false },
            which: 13
        }
        editor.editor.onKeyDownInternal(event, true, false, false);
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Undo Redo multiple times at paragraph middle', () => {
        for (let i: number = 0; i < 5; i++) {
            editor.editorHistory.undo();
            expect(editor.viewer.pages.length).toBe(1);
            editor.editorHistory.redo();
            expect(editor.viewer.pages.length).toBe(2);
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

describe('Insert page break history preservation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, enableEditorHistory: true });
        viewer = editor.viewer as PageLayoutViewer;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
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
    it('Insert Page break at paragraph middle', () => {
        editor.editor.insertText('Syncfusion Software', false);
        editor.editor.onEnter();
        editor.editor.insertText('Syncfusion Software', false);
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.editor.insertPageBreak();
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.bodyWidget.childWidgets.length).toBe(2);
        editor.editorHistory.redo();
        expect(editor.viewer.pages.length).toBe(2);
    });
    it('Insert Page Break on non empty selection', () => {
        editor.openBlank();
        editor.editor.insertText('Syncfusion Software', false);
        editor.editor.onEnter();
        editor.editor.insertText('Syncfusion Software', false);
        editor.editor.onEnter();
        editor.editor.insertText('Syncfusion Software', false);
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        editor.selection.moveNextPosition();
        editor.selection.moveNextPosition();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.editor.insertPageBreak();
        editor.editorHistory.undo();
        expect(editor.viewer.pages.length).toBe(1);
        editor.editorHistory.redo();
        expect(editor.viewer.pages.length).toBe(2);
    });
});