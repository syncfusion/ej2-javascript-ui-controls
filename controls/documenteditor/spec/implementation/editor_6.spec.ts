import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, BookmarkDialog } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';
import { ListView } from '@syncfusion/ej2-lists';

let tableContents: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36 }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Search Text operation " }, { "characterFormat": { "bold": true }, "text": "for text which is " }, { "characterFormat": { "bold": true }, "text": "available in the Pdf Document" }, { "characterFormat": { "bold": true }, "text": ":" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "The following table contains the process memory strategy for 1000 pages Pdf Document." }] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Task Manager" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": "Visual studio diagnostic " }, { "characterFormat": { "bold": true, "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": "Tool" }, { "characterFormat": { "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": " " }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": "Before fix" }, { "characterFormat": { "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": " " }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "26" }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }, { "characterFormat": {}, "text": "0" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "330" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": "After fix" }, { "characterFormat": { "fontSize": 10.5, "fontFamily": "Arial", "fontColor": "#333333FF" }, "text": " " }] }, { "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "140" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "180" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 156, "preferredWidthType": "Point", "cellWidth": 156, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }], "grid": [155.8000030517578, 155.85000610351562, 155.85000610351562], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 0, "leftMargin": 0, "bottomMargin": 0, "preferredWidth": 468, "preferredWidthType": "Point" }, "description": null, "title": null }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Find Text operation " }, { "characterFormat": { "bold": true }, "text": "for text which is not available in the Pdf Document" }, { "characterFormat": { "bold": true }, "text": ":" }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "The following table contains the process memory strategy for 1000 pages Pdf Document." }] }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 152.5, "preferredWidthType": "Point", "cellWidth": 152.5, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Task Manager" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 162, "preferredWidthType": "Point", "cellWidth": 162, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Diagnostic Tool" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 153, "preferredWidthType": "Point", "cellWidth": 153, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 9.399999618530273, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "Before fix" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 152.5, "preferredWidthType": "Point", "cellWidth": 152.5, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "1600MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 162, "preferredWidthType": "Point", "cellWidth": 162, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "2.1GB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 153, "preferredWidthType": "Point", "cellWidth": 153, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": { "bold": true }, "inlines": [{ "characterFormat": { "bold": true }, "text": "After fix" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 152.5, "preferredWidthType": "Point", "cellWidth": 152.5, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "9" }, { "characterFormat": {}, "text": "8" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 162, "preferredWidthType": "Point", "cellWidth": 162, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "lineSpacing": 1.0666667222976685, "lineSpacingType": "Multiple", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "text": "138" }, { "characterFormat": {}, "text": "MB" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Cleared", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 1, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "topMargin": 0, "rightMargin": 5.400000095367432, "leftMargin": 5.400000095367432, "bottomMargin": 0, "preferredWidth": 153, "preferredWidthType": "Point", "cellWidth": 153, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }], "grid": [152.5, 162, 153], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": true, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 0, "leftMargin": 0, "bottomMargin": 0, "preferredWidth": 467.5, "preferredWidthType": "Point" }, "description": null, "title": null }, { "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "fontSize": 11, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {} }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri" }, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Insert table validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('load the table of contents document border validation', () => {
console.log('load the table of contents document border validation');
        editor.open(JSON.stringify(tableContents));
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.handleRightKey();
        let cellWidget: TableCellWidget = editor.selection.start.paragraph.containerWidget as TableCellWidget;
        expect(cellWidget.cellFormat.borders.left.lineStyle).toBe('Cleared');
        expect(TableCellWidget.getCellLeftBorder(cellWidget).lineStyle).toBe('Single');
    });

});



describe('ApplyStyle API validation - 1', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('set ClearDirectFormatting as true', () => {
console.log('set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.selection.characterFormat.fontFamily = 'Algerian';
        editor.selection.paragraphFormat.textAlignment = 'Right';
        editor.editor.applyStyle('Heading 1', true);
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Algerian');
        expect(editor.selection.characterFormat.fontSize).toBe(24);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('ApplyStyle API validation - 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true', () => {
console.log('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.editor.applyStyle('Heading 1', true);
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.editor.applyStyle('Heading 4', true);
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.italic).toBe(false);
        expect(editor.selection.characterFormat.fontSize).toBe(24);
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});


describe('ApplyStyle API validation - 2 without History', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('without specify ClearDirectFormatting', () => {
console.log('without specify ClearDirectFormatting');
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.editor.applyStyle('Heading 4');
        expect(editor.selection.characterFormat.fontSize).toBe(24);
    });
    it('with ClearDirectFormatting', () => {
console.log('with ClearDirectFormatting');
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.editor.applyStyle('Heading 4', true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});

describe('Adding bookmark link in empty paragraph validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableBookmarkDialog: true });
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Adding bookmark link in empty paragraph', () => {
console.log('Adding bookmark link in empty paragraph');
        editor.showBookmarkDialog();
        (document.getElementById('bookmark_text_box') as any).value = 'firstpage';
        editor.bookmarkDialogModule.onKeyUpOnTextBox();
        (document.getElementById('add') as HTMLButtonElement).disabled = false;
        document.getElementById('add').click();
        expect(editor.documentHelper.bookmarks.length).toBe(1);
    });
});


describe('Apply Character format in empty selection and paragraph is Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('undo -after apply character format in empty selection', () => {
console.log('undo -after apply character format in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });

    it('redo -after apply character format in empty selection', () => {
console.log('redo -after apply character format in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });

    it('multiple undo and redo -after apply character format in empty selection', () => {
console.log('multiple undo and redo -after apply character format in empty selection');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

describe('Apply Character format in empty selection and paragraph is not Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.editor.insertText('Sample');
        editor.selection.characterFormat.fontSize = 48;
        editor.selection.characterFormat.fontColor = 'Red';
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Enter -after apply character format and paragraph is not empty', () => {
console.log('Enter -after apply character format and paragraph is not empty');
        editor.editor.onEnter();
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Undo - Enter -after apply character format and paragraph is not empty', () => {
console.log('Undo - Enter -after apply character format and paragraph is not empty');
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});
