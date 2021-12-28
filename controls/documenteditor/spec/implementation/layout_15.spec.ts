import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Selection, Layout, PageLayoutViewer, ParagraphWidget, LineWidget, TextElementBox, ListTextElementBox, TableCellWidget, WBorder, TableRowWidget, TableWidget, FieldTextElementBox } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

let autoFitTableJson: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 36, "rightMargin": 36, "topMargin": 48, "bottomMargin": 48, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Heading 3", "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "PERFORMANCE " }, { "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "MEASURES" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2010" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2011" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2012" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2013" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2014" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2015" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2016" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2017" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bold": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2018" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Center" }, "columnIndex": 9 }], "rowFormat": { "height": 24.5, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": true, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Fatalities" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Serious Injuries" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "5" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "6" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "7" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "8" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Fatality rate (per " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "HMVMT)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "9.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "10.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "11.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "12.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Serious injury rate (per " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "HMVMT)" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "13.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "14.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "15.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "16.000" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Number " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "non" }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": " " }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "motorized" }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": " " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "fatalities" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "17" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "18" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "19" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "1" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "2" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "3" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "4" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "20" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "Number of " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "non" }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": " " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "motorized" }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": " serious " }, { "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "injuries" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 128, "preferredWidthType": "Point", "cellWidth": 112.57328990228012, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "21" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "22" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 2 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "23" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 3 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "99" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 4 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "99" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 5 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "99" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 6 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "99" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 7 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "34" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 8 }, { "blocks": [{ "paragraphFormat": { "textAlignment": "Left", "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "text": "24" }] }], "cellFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "shading": {}, "preferredWidth": 54, "preferredWidthType": "Point", "cellWidth": 47.491856677524424, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 9 }], "rowFormat": { "height": 1, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "left": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "right": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "bottom": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "vertical": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 } }, "gridBefore": 0, "gridAfter": 0, "leftMargin": 5, "topMargin": 5, "rightMargin": 5, "bottomMargin": 5 } }], "grid": [112.57328990228012, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424, 47.491856677524424], "tableFormat": { "borders": { "top": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "left": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "right": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "bottom": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "diagonalDown": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "diagonalUp": { "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0 }, "horizontal": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 }, "vertical": { "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5 } }, "shading": {}, "leftIndent": 0, "topMargin": 5, "rightMargin": 5, "leftMargin": 5, "bottomMargin": 5, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": true }, "description": "Data presented showing the general highway safety trends in the State for five year average.", "title": "General Highway Safety Trends.", "columnCount": 10 }, { "paragraphFormat": { "styleName": "Heading 3", "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "firstPageHeader": { "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [] }] } } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Times New Roman", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Times New Roman" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontSizeBidi": 12 }, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 16, "fontFamily": "Arial", "boldBidi": true, "fontSizeBidi": 16, "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "bold": true, "italic": true, "fontSize": 14, "fontFamily": "Arial", "boldBidi": true, "italicBidi": true, "fontSizeBidi": 14, "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 13, "fontFamily": "Arial", "boldBidi": true, "fontSizeBidi": 13, "fontFamilyBidi": "Arial" }, "basedOn": "Normal", "next": "Normal" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 14, "boldBidi": true, "fontSizeBidi": 14 }, "basedOn": "Normal" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "bold": true, "italic": true, "fontSize": 13, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 13 }, "basedOn": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "HSIPStyle", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "Footer", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "listFormat": {} }, "characterFormat": { "italic": true, "fontSize": 10, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "html_content", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "Header", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "Title", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "beforeSpacing": 12, "afterSpacing": 3, "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 16, "fontFamily": "Arial", "boldBidi": true, "fontSizeBidi": 16, "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "tableofContents", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 14, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "sectionsubdescription", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 11, "fontFamily": "Arial", "fontColor": "#0000FFFF", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "firstpage", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 18, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "stateDescription", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 20, "fontFamily": "Arial", "fontColor": "#7F7F7FFF", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "annualYearStyleReportHeader", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 20, "fontFamily": "Arial", "fontColor": "#409E66FF", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "reportName", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 24, "fontFamily": "Arial", "fontColor": "#000080FF", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "reviewerTitle", "type": "Paragraph", "paragraphFormat": { "textAlignment": "Center", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 18, "fontFamily": "Atial", "fontFamilyBidi": "Atial" }, "basedOn": "Normal" }, { "name": "pictureSource", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 8, "fontFamily": "Arial", "fontFamilyBidi": "Arial" }, "basedOn": "Normal" }, { "name": "TOC 9", "type": "Paragraph", "paragraphFormat": { "leftIndent": 96, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal" }, { "name": "Hyperlink", "type": "Character", "characterFormat": { "underline": "Single", "fontColor": "#0000FFFF" }, "basedOn": "Default Paragraph Font" }, { "name": "TOC 1", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal" }, { "name": "TOC 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 12, "listFormat": {} }, "characterFormat": {}, "basedOn": "Normal" }, { "name": "Balloon Text", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Normal", "link": "Balloon Text Char" }, { "name": "Balloon Text Char", "type": "Character", "characterFormat": { "fontSize": 9, "fontFamily": "Segoe UI", "fontSizeBidi": 9, "fontFamilyBidi": "Segoe UI" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [] };
describe('Auto fit table exceeds container width', () => {
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
        editor.open(JSON.stringify(autoFitTableJson));
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
    it('validation', () => {
console.log('validation');
        editor.selection.handleDownKey();
        let table: TableWidget = editor.selection.tableFormat.table;
        expect(table.tableFormat.preferredWidth == table.getOwnerWidth(true)).toBe(false);
    });
});

describe('Auto fit nested table', () => {
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

    it('Parent cell has preffered width', () => {
        console.log('Parent cell has preffered width');
        editor.open(getTableDocument());
        let parentCellPrefferedWidth = editor.selection.start.paragraph.associatedCell.ownerTable.associatedCell.cellFormat.preferredWidth;
        let nestedTableWidth = editor.selection.start.paragraph.associatedCell.ownerTable.getTableWidth();
        expect(nestedTableWidth).toBeLessThanOrEqual(parentCellPrefferedWidth);
    });
});


function getTableDocument(): string {
    return '{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":35.25,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"leftMargin":0.0,"rightMargin":0.0},"cells":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":15.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"leftMargin":0.0,"rightMargin":0.0},"cells":[{"blocks":[{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"Rent:","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":77.1500015258789,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":77.1500015258789}},{"blocks":[{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"rightIndent":5.0,"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","textAlignment":"Right","styleName":"Normal"},"inlines":[{"text":"@","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}},{"text":"Amount","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}},{"text":"@","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":161.14999389648438,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":161.14999389648438}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftMargin":0.0,"rightMargin":0.0,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":" ","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":249.89999389648438,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":249.89999389648438}},{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":15.75,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"leftMargin":0.0,"rightMargin":0.0},"cells":[{"blocks":[{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":"Security Deposit:","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":88.0999984741211,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":88.0999984741211}},{"blocks":[{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","textAlignment":"Right","styleName":"Normal"},"inlines":[{"text":"@@DepositRefund@@","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":117.5999984741211,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":117.5999984741211}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftMargin":0.0,"rightMargin":0.0,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","styleName":"Normal"},"inlines":[{"text":" ","characterFormat":{"fontSize":10.0,"fontFamily":"Arial","fontColor":"#000000FF","fontSizeBidi":10.0,"fontFamilyBidi":"Arial"}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]}],"cellFormat":{"leftMargin":5.400000095367432,"rightMargin":5.400000095367432,"topMargin":0.0,"bottomMargin":0.0,"columnSpan":1,"rowSpan":1,"preferredWidth":217.3000030517578,"preferredWidthType":"Point","verticalAlignment":"Top","isSamePaddingAsTable":false,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#FFFFFFFF"},"cellWidth":217.3000030517578}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftMargin":0.0,"rightMargin":0.0,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"shading":{"texture":"TextureNone","backgroundColor":"#EEEEEEFF"},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"characterFormat":{"fontColor":"empty"},"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontColor":"empty","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontColor":"empty"}},{"type":"Character","name":"Default Paragraph Font","characterFormat":{"fontColor":"empty"}},{"type":"Paragraph","name":"Normal (Web)","basedOn":"Normal","next":"Normal (Web)","characterFormat":{"fontSize":12.0,"fontFamily":"Times New Roman","fontColor":"empty","fontSizeBidi":12.0,"fontFamilyBidi":"Times New Roman"},"paragraphFormat":{"beforeSpacing":5.0,"afterSpacing":5.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":false,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true}';
}



describe('Copy and paste excel table', () => {
    let editor: DocumentEditor = undefined;
    let rtfTable: string = '{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":15.100000381469727,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false}},"leftMargin":1.5,"rightMargin":1.5,"topMargin":0,"bottomMargin":0},"cells":[{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":10,"fontFamily":"Segoe UI","fontColor":"#808080FF","fontSizeBidi":10,"fontFamilyBidi":"Segoe UI"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Trigger open/import action via API","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":10,"fontFamily":"Segoe UI","fontColor":"#808080FF","fontSizeBidi":10,"fontFamilyBidi":"Segoe UI"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidthType":"Auto","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"vertical":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"diagonalUp":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true}},"shading":{"texture":"TextureSolid","backgroundColor":"#000000FF","foregroundColor":"#F6F7F7FF"}}},{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":10,"fontFamily":"Segoe UI","fontColor":"#808080FF","fontSizeBidi":10,"fontFamilyBidi":"Segoe UI"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[{"text":"JavaScript - EJ 2","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":10,"fontFamily":"Segoe UI","fontColor":"#808080FF","fontSizeBidi":10,"fontFamilyBidi":"Segoe UI"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidthType":"Auto","verticalAlignment":"Top","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"right":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"top":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"bottom":{"lineStyle":"Single","lineWidth":0.75,"shadow":false,"space":0,"hasNoneStyle":false,"color":"#C0C0C0FF"},"vertical":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"diagonalUp":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true}},"shading":{"texture":"TextureSolid","backgroundColor":"#000000FF","foregroundColor":"#F6F7F7FF"}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":false,"leftMargin":1.5,"rightMargin":1.5,"topMargin":0,"bottomMargin":0,"leftIndent":0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"right":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"top":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"bottom":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"vertical":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"horizontal":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":true},"diagonalDown":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0,"shadow":false,"space":0,"hasNoneStyle":false}},"bidi":false}},{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":10,"fontFamily":"Calibri","fontColor":"#00000000"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"BodyText","textAlignment":"Left","styleName":"Normal","bidi":false,"contextualSpacing":false},"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":595.2999877929688,"pageHeight":841.9000244140625,"leftMargin":50,"rightMargin":20,"topMargin":20,"bottomMargin":20,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"fontSize":12,"fontFamily":"Times New Roman","fontSizeBidi":12}},{"type":"Character","name":"Default Paragraph Font"}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false}';
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
        editor.open(rtfTable);
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        rtfTable = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('validation', () => {
console.log('validation');
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.borders.left.lineStyle).toBe('Single');
    });
});

let listData:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Justify","afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Sample"},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{"listId":30,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"List1"}]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{"listId":30,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"List2"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"textAlignment":"Justify","beforeSpacing":4.699999809265137,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{"listId":0},"contextualSpacing":true},"characterFormat":{"fontFamily":"Arial","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontFamily":"Arial","fontSizeBidi":12,"fontFamilyBidi":"Arial"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":5.349999904632568,"beforeSpacing":3.549999952316284,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontFamily":"Arial","underline":"Single","fontSizeBidi":12.5},"basedOn":"Normal","link":"Heading 2 Char","next":"Heading 2"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontFamily":"Arial","underline":"Single","fontSizeBidi":12.5},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"annotation reference","type":"Character","characterFormat":{"fontSize":8,"fontSizeBidi":8},"basedOn":"Default Paragraph Font"},{"name":"annotation text","type":"Paragraph","paragraphFormat":{"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Normal","link":"Comment Text Char","next":"annotation text"},{"name":"Comment Text Char","type":"Character","characterFormat":{"fontSize":10,"fontSizeBidi":10},"basedOn":"Default Paragraph Font"},{"name":"annotation subject","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"annotation text","link":"Comment Subject Char","next":"annotation text"},{"name":"Comment Subject Char","type":"Character","characterFormat":{"bold":true,"fontSize":10,"boldBidi":true,"fontSizeBidi":10},"basedOn":"Comment Text Char"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Revision","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{},"next":"Revision"},{"name":"Hyperlink","type":"Character","characterFormat":{"underline":"Single","fontColor":"#0563C1FF"},"basedOn":"Default Paragraph Font"},{"name":"Unresolved Mention","type":"Character","characterFormat":{"fontColor":"#605E5CFF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":0,"levelOverrides":[{"startAt":1,"levelNumber":0}],"listId":30}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"bold":false},"paragraphFormat":{"leftIndent":27.350000381469727,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":".%1","restartLevel":0,"startAt":1},{"characterFormat":{"fontFamily":"Symbol"},"paragraphFormat":{"leftIndent":54.70000076293945,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"leftIndent":82.05000305175781,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":109.4000015258789,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":136.75,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":164.10000610351562,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":191.4499969482422,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":218.8000030517578,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":246.14999389648438,"firstLineIndent":-27.350000381469727,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[]};
describe('List level override layout validation', () => {
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
        editor.open(listData);
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
    it('Start at override', () => {
console.log('Start at override');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        expect((editor.selection.start.currentWidget.children[0] as ListTextElementBox).text).toBe('.1');
    });
});
let doc1 : any = {
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
                       "beforeSpacing": 18,
                       "afterSpacing": 30,
                       "styleName": "Heading 1",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontSize": 18,
                       "fontFamily": "Calibri",
                       "fontSizeBidi": 18,
                       "fontFamilyBidi": "Calibri"
                    },
                    "inlines": [
                       {
                          "characterFormat": {
                             "fontSize": 18,
                             "fontFamily": "Calibri",
                             "fontSizeBidi": 18,
                             "fontFamilyBidi": "Calibri"
                          },
                          "text": "Adventure Works Cycles"
                       }
                    ]
                 },
                 {
                    "paragraphFormat": {
                       "firstLineIndent": 36,
                       "afterSpacing": 6,
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontSize": 12,
                       "fontColor": "empty",
                       "fontSizeBidi": 12
                    },
                    "inlines": [
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "Adventure Works Cycles, the fictitious company on which the Adventure Works sample "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "databases are based, is a large, multinational manufacturing company. The company "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "manufactures and sells metal and "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "composite bicycles to North "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "American, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "European"
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": " and Asian "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "commercial markets. While its base "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "operation "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "is located in"
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": " Bothell, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "Washington with 290 "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "employees, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "several regional sales teams are located throughout their market base."
                       }
                    ]
                 },
                 {
                    "paragraphFormat": {
                       "firstLineIndent": 36,
                       "afterSpacing": 6,
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontSize": 12,
                       "fontColor": "empty",
                       "fontSizeBidi": 12
                    },
                    "inlines": [
                       {
                          "characterFormat": {},
                          "shapeId": 1,
                          "name": "Text Box 5",
                          "visible": true,
                          "width": 99.36,
                          "height": 38.16,
                          "widthScale": 100,
                          "heightScale": 100,
                          "verticalPosition": -55.5,
                          "verticalOrigin": "Line",
                          "verticalAlignment": "None",
                          "verticalRelativePercent": -3.4028235E38,
                          "horizontalPosition": 0,
                          "horizontalOrigin": "Margin",
                          "horizontalAlignment": "Center",
                          "horizontalRelativePercent": -3.4028235E38,
                          "zOrderPosition": 251659264,
                          "allowOverlap": true,
                          "textWrappingStyle": "Square",
                          "textWrappingType": "Both",
                          "distanceBottom": 0,
                          "distanceLeft": 9,
                          "distanceRight": 9,
                          "distanceTop": 0,
                          "layoutInCell": true,
                          "lockAnchor": false,
                          "autoShapeType": "Rectangle",
                          "fillFormat": {
                             "color": "#FFFFFFFF"
                          },
                          "lineFormat": {
                             "lineFormatType": "Solid",
                             "color": "#000000FF",
                             "weight": 1,
                             "lineStyle": "Solid",
                             "line": true
                          },
                          "textFrame": {
                             "textVerticalAlignment": "Top",
                             "leftMargin": 1.70858,
                             "rightMargin": 1.70858,
                             "topMargin": 0.85429,
                             "bottomMargin": 0.85429,
                             "blocks": [
                                {
                                   "paragraphFormat": {
                                      "styleName": "Normal",
                                      "listFormat": {}
                                   },
                                   "characterFormat": {
                                      "fontColor": "empty"
                                   },
                                   "inlines": [
                                      {
                                         "characterFormat": {
                                            "fontSize": 12,
                                            "fontColor": "empty",
                                            "fontSizeBidi": 12
                                         },
                                         "text": "Adventure Works "
                                      },
                                      {
                                         "characterFormat": {
                                            "fontSize": 12,
                                            "fontColor": "empty",
                                            "fontSizeBidi": 12
                                         },
                                         "text": "Cycles"
                                      }
                                   ]
                                }
                             ]
                          }
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "In 2000, Adventure Works Cycles bought a small manufacturing plant, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "Importadores"
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": " "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "Neptuno, located in Mexico. Import adores Neptuno manufactures several critical "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "subcomponents for the Adventure Works Cycles product line. These subcomponents are "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "shipped to the Bothell location for final product assembly. In 2001, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "Importadores"
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": " Neptuno, "
                       },
                       {
                          "characterFormat": {
                             "fontSize": 12,
                             "fontColor": "empty",
                             "fontSizeBidi": 12
                          },
                          "text": "became the sole manufacturer and distributor of the touring bicycle product group."
                       }
                    ]
                 },
                 {
                    "paragraphFormat": {
                       "styleName": "Heading 1",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontFamily": "Calibri",
                       "fontFamilyBidi": "Calibri"
                    },
                    "inlines": [
                       {
                          "characterFormat": {
                             "fontFamily": "Calibri",
                             "fontFamilyBidi": "Calibri"
                          },
                          "text": "Product Overview"
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
                                         "textAlignment": "Center",
                                         "beforeSpacing": 6,
                                         "afterSpacing": 0,
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {},
                                            "imageString": "data:image/gif;base64,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",
                                            "isMetaFile": false,
                                            "width": 142.2,
                                            "height": 88.28252,
                                            "iscrop": false,
                                            "name": "Picture 2",
                                            "visible": true,
                                            "widthScale": 79,
                                            "heightScale": 79.000015,
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 0
                             },
                             {
                                "blocks": [
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "beforeSpacing": 6,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontFamily": "Calibri",
                                               "fontFamilyBidi": "Calibri"
                                            },
                                            "text": "Mountain-200"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Product No: BK-M68B-38"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Size: 38"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Weight: 25"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Price: $2,294.99"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": []
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 1
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
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "left": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "right": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "bottom": {
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
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "vertical": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                }
                             },
                             "gridBefore": 0,
                             "gridAfter": 0
                          }
                       },
                       {
                          "cells": [
                             {
                                "blocks": [
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "beforeSpacing": 6,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontFamily": "Calibri",
                                               "fontFamilyBidi": "Calibri"
                                            },
                                            "text": "Mountain-300 "
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Product No: BK-M47B-38"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Size: 35"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Weight: 22"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Price: $1,079.99"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": []
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 0
                             },
                             {
                                "blocks": [
                                   {
                                      "paragraphFormat": {
                                         "textAlignment": "Center",
                                         "beforeSpacing": 6,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {},
                                            "imageString": "data:image/gif;base64,R0lGODlh8ACVAPcAAMjI2HONu3h0eNPT087Ozrm6x/r6+sTDxKOjpGhjaeHe6dzb87vD0VhTWezs+3h4h5ubpLOztKiVlry7vcK+xZujrqysrcvK5e3s86qquJybndTT7EI8QuPi9EpESsrKylJMUuTk7Pb19mJcYtzc5PHu8/v9/fLx8tzb7aSdo4uKlSomKcS7u+Td3O7t7uTj+1pYYIJ8gzo0OrOts+bm5nJscurp6tLO09LMzPr6/uLg4pKNk/39+mJTWtPS5WpocNTT2bOqq8nEvvb6+pSRlMTFy83R19ra2vn3+tzk6E1JUY2Ljerl5ZSKjHJnaitGY394fP37/d7e3jQwNExHTern6vb1+q3U4qSjrI+o1DMtMjo6Q9rW2vLt7jw5PYSChPv699bV8bW0u+Ph3kQ/RUE3PpuUm+3w9LiyrPb2/rCimYuGi/Hw+622x62xt/j397u2u9PQzVFHTqmkpaylrP37+7m0tPHx/cjFxoSDjLi81MvFyvbz9pWUnNnU1cbIzNva1aO80srLzoOY2fPz9O7q7vr9+2x3p+bi5vTy7ZmatOvr7Kasw1Zxkvf59oqFhfXz8o3U7JiUlczJxUZCSdnY8zgyNkpARt7e94qXqoaCf+bo7Nra3i8qLebi4uPj5O3q6uvo5tjW7c3LysTV5vb18ltgcNDO5YOJpd7Z2ujn+3y8783M8c7Jzt7b3by5tjY0OKaorfP19s3Ny+fl4urt7oWbvJyQjWiB0ejm9LSxxri6ve7t6/Tz+dbY2/H2+ampqIeIjPTz/97d25KJpI2PlnZwcC0qLiYfJRgUFpecntnX5aenp4+JhvP28+Pl5+Pl49Xa8R8bHLDA4dfX1lFQWdvd2rCwsG9veujp9+fo5cfHxre4t6Sw1p+goGRgYhQeMDk3NkhHRv39/f///f/9//3////9/f39//3//cvNzu/w7+vt69vd3cDAwdja40dGTTAvMOnp/iMhIo+QjuDg2h8tP2paqWhgj1pquzVXfJiYmNDQ8p+bmf7+/v///yH5BAAAAAAALAAAAADwAJUAAAj/AP8JHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMlypb+WMGPKhOnv5cCaM3Pq3OnRxLiB42zyHEq0KEN/Jv4ZSIrTKEpzBIU6nYqwZpQINAgJlEoVJFIT5l4G5dqV6ssBMb7UsBCFbNmO5qAONOD2rVETRASMCJZAh92P/s64IERoDDNjE/7axRPMWIIYP6gp3tirA6lpKLRtw/Yk2ZfJXd8sKdaAL5Rx5UALNHFCyqhXr/bE0WHDxro3BnK/WVcLQwcf04IHr9Doib0VH1QX9fdzQo1qDYpdetR262QajxIk+CFgSZ60j5bs/9OgAYJ5RYy6dcuSxVaAQ/qMr9CgnCjSfy4EwODAAYaMBCX881JTdomwQw2mPLHFE0pUA0KDDTQwwjfYYNNII4cccuGFT3TIwTX12ZeUBQJ4oUUnWoywRwLXvEEYIXVNFcUn/SAIDxkJHNKhPfZscUkDpugj5JAdVsOBBSES9dMnNZCxghdTWALFEitQ8YUAAkQQY1f+vGHDIqVEMcEDqDQCTjLITHEJFfB0uAU8lMTzBTlJDuWPORpAUQ0ynZQxQgpyWEIFFRESYUCd/6SGwxy3GDOCJchIg6IMnXBARoqLIDrUAMD8g8cKyJDRgCYeODGHEyP8EAOMQQVVX5d4WP/SAwh8doJMhN/IMA8U62i6KWEggHDJFByAIEMPKVCQAhQHCDiOCcxtaVYUUpBRAwfJOPHFGlXAcS0z1vnK0yfkUSLDCmVwYAkIu1Awgx1SrBaVauVUQQcMJ1qSwCcCQSLCauP8JO5OBiAwggxUCFuGDBqQIIgYwLhDwz/ajPJBr6D5E8UwrdBBDw4xgNgUgQMT/IoA33hQxiUgLByDO+q4Y4EFsTgKhSQ3RPFsUmWRk44VdjiRwC5a/ROwwCUbNQoUxjjBgQwN7CAAsc0U8ccMGvzgASUjQDFBTTx3xYMhiKghRBOtQFITUtImLdMRjxCh6gdRlGPHCCnuAAKWHkz/IYMTEQgYNlVjj4LGJBK0YwgPAQ/udlEiuHPET+YkJUIKHnTiRRmUmAiCE4nd1xU54wyBhhBBBFGLCec8rlhQJvCsQwxllOGFFzKUse8/YfVMThWH3yKELP+07nqIxmhBhiVlOEHHP0z57ssfeJjBCbR0Hq+aCWckb4kll0BRhYB/kcPMARYE44I/PGSvvWIuGBHIIT+AYEkKUWzlalmFeLMNFN4wADl40Lb38UQWJHADMxigiD6oQACtGIg5yOEPcliQgnY61D9uoIEDfGMUNzFgWfyRBAYwAAuKiMMsCoAFb2jAAtuAhgYpWBOk5aSGNYkAHPbxg0wVUIQ5OYMJ/xngjQIQQB0EiIMgDsANZngjYvUohUAwyBPmjEME3ohAd3j2QyDG5B0MOEMREKCOWcziAx8wIwEIsI0JWMAbzHgFIE4gon9IQQAN4AAeyOfFG9bFAAAAgAmucQ0CfIAGLpDCAAyZxjV+YALXQAACuEGAddhQLv9w30ni4ikqaKEBNCBZH1uyNoScoQBJWIQ33GHIIyxCBCbwUjsIIAg0rnEWB4ikN67xAW2EbYCaNInP/CGJS6wgBvsbZUy2RAIGWEEdCBDELNTxgW3MghqfOIEBorCOT1CDmo1UBx6a+MQD1MMRLbHgOmpQhk58rYvKdAkAjJADCxTSjLMQRBlt6f9KEeTGBrNE4wfWuI1dAMMbCJhAO4qmEjzYjxLxoks8i0IIBoRgE944AAHUuAtFiOEAs9hoGqmhA20a4AQ6AAI4Q/oBmSE0AtTAGEkMcAQaWEAOyBAAEtg2UaI0cwh/iCY+cXkNYCBgl+4Y6BkHegRt+FMEizgCI0Maswh4Y5fqWATP4hIWeCLEHOn4hw4QQA1quAMKSApYT4liBAAYwAIR2KgaZwDXRVCDG0dlxi6sycgPDEAHLjDAG07wiQGcMaS4jIATLXAAaLyBIxP8xyRQMYgCDIAasziCT9bKk4omYRMdlOs00YiAV9DJGVI4wEGZEYEDCEKkTNUGIUxAiEX/zJKaZtwGNw4aMWv8SyPkAAYuVpGFQbRhG5r1KmdHUkIkFCEW0hyqGT/gjQmMQy51sMEsrIoAC0xgoFP9qwtw081vpvGMbpTkLqhBx4vYAAJZSMIvXpAFd5yAp8udyTzfmoIJiBafbFylBdORDpsQghoTcCIwuLGNW9qSGlkxgAhsoMjzttQCR43AAGxQEQJ4Iw6jKMIFxMCNlzguvyyRhUWfgQAJ4KGM0z0vGzWwDegRsCBvgAb6XuoOxAp0AFIY70m9acgzHiACR7XAIU+sEHNEwA0qnMUfICAZFOckBAwwQBHMEAQjDFUb1JDxATQwC94lxAQ2GACSveHdBsOW/wDYJIRgXdAOw5qRiQp2hw5+uxAssjKk7oBAe60sEyMYwQCxoAMLRHtIAxghugQY8wAcQggpuMOJkwQpbP0qhUW8wUU0oMYRZ1HQN+r1CAw9iC+8AWk3gIjQMkECAzbxDG/MQLpopIEJjiBjd2hg0g8xwSc+8EYEXCOpDh7pJ9Yh4UQuEo0uRUBcLWkQd8RCrtAEIaxJ+Y9NZLkIKXjxUNP4ARsYgBMynoAGrJEoiPhjHQPYxVGBsVcf27IdNpDFSWkg1TO6Q5e81IbACraLjUYaAtrYdkyAcGgsROC8+CxCN6i5CHOgW43c0MAYeIfJh7whtaZubUhhO4sBLBs37P/Qgag/cGQF48ETOvDGH8yojl0wgwcKb4kBGLAIEihDo0MlAA4yYM0P8MLiMrbqxJjsEAPY4APXuOqxwbtUpubbALLgt2EPMAFb2KICsYCxILDQrJyzxNsGKAACpDuLIqyiAgg4rwv+cfGQWpXDGVnHEfDK5gm4meR/vY0BuhmHKwQiE3CQ6x+8MYyOm30id+Kq5LNHMgv6AgiyqIAd/jsLBqwiFgg9b694rcZIriMuFsRIBDSgS9ZqetMEqKkI2oGDbXiDARv9g7xl4fiIDChgIzPaWNTaKqEo9y81IUdc1hYXpqh1IOR4AwNqQYIOSjfS3sADIaw681ncl/QhtQD/MwhRueMXxKYIOIA7FNiP7iJbrgJdI17FbgFumLkiY/lHHYrPHJ886/9HE3xuAzbRwhxbMSBSQQ7NpXbXp24EIBAGEHUzRwCEMA7gRwDAYAFS1HsTYQC2ZwFtQACBMAhv9EQMhkRyRQDM4AZyRUSTZkO+V0PJVBUCAXw2YX5cwoEHIRX+YARAQAgOJ1oEsHpHQBClEEkTCEvgNwvM0CIc8QkYNgEMQAoHll4awFru8FqL92d/4A7ecHQ4VxE2UQ5vUAg6wAUDgAN48AGjEAepUAUnMDhjgYM6YUEISBDlQAjPcASTwHWvoH544Adc4AIiIBWyRn2hhU9vxC8Ccif//yACSFhysBRm+CRth4J6R7ElHvhCe6BrtTAALKdYUqcImaAHuedq1xVMB8FVYiEUSMAFEbADmuAE3/ANVAADIEAFKTMCMAADAhAMwDAAGpRJysc7xThCydc+NiECOqCCZrAERAAFAlADCcA0j7AGArADa7ADL0QBiBAFGJBl8qZGs2BUmRIVL/EGGCYIozAAb2AClGhI3gAHURA7BdQUkWUQUOgNuwAE/sRrBOUO3NAPFfAHtMQAzJAcfGQQI+N/ArMO25ACMQADI8AyeQQC4kAJIEAGSkAFHkAGHAAl4UAG37AEeIAx9hg7JqCKSmJFAnECBHANS7AGTTONX2AzCf9QAwLwGN+wkzXwAzBQA98ABW5AAkAYV4aEAMCQagbxBkbFjsJoAPFoe+5ADuWQGhABFW6xiRZQBDTgdEUWe25gRNNERAm3kAXRFM8iECLABXMABQ2gBDDgAXJJBhgpDkpACfDAH5RgKV5ACWTgBeryPQ2wBATAM0FhAJikgzJRSuOQCjOwBj+wBjDwA1DwDY4BA98AAjAQISPAmRKSAJU5AjUAAg0AAWfwDhqABwHmhAshC8CABVApYWG5DR1ERcEGLQnxCQc1AT/4BryWRnrAACHFABCjQTFSSv+wDu6gFoQCA4NiJH25BbCwBTKwBVvAAdhpnTLgBbAgmIIZDuH/0Ak48grEUzmSx5g5MQBE4AQ6WQ0/OQIj0AC5mJdKcJ8Ncp9wQglKECyf2QAVYAQQow4HUF1MRxDKdwbAAF0fQA0G4AJhOWY1dn8MQQ4+oTF/NGZd+Ql1sAhFhk8MYAHuEEIIsZZRcAAoIyoJQAZUQAZbMAXf6QHwYAoVUg0wgA0/UCGmEJdKYCJRIgPdCQuaAwMlxnFcpRPjYAi6+Q+C8AUNkADfAAMJQJ/3SQXQ8QM1gA2ogAoq8AMPoAJ5oAIPYAqmUA1KoJ0w4AZ6gACBEAlBAAVmwAT64yrPl0kvcQILWkvUYAIe2khj9oCx0xG8yY9GcALAiUZSFghzMAy8/zMO1SEQ6OkPWHkDX5AyvUgG4qAuxNKZnEkJ1eAgeQkPoiqqNgoFXwAFI0AFJgILsCCe8QALAiAIq6GkNZGe6ukV9ihWfZCLnDkCDtKiZAAPP0AE1OgENiqlnSmf2pEA2PAAS/AFqaIHBTAHkRAIRNADP5ICdGQIYjGDA3ECzMCgk/N0auRrfpBJtyoRBjBm11AEOmAAvMBIZvAFchowBoA05fcTNJACMCAHn+kFl8ABsDAFMCoqmQoCpBkDRJACWNCwGrADMeAEeUQJT4oNUAADU9AJUyCe4XAMsEAEc2cChoAOJIsOscNJJhEt5BMF2/ANlEAo9OkBVEAJHrA1LP/qmTXwAMGwDylABz6rAXmwk/RZDT9gDBDAAG7gBpEQATUgB3IAAnJQAzcAMDBIEOswB1hQBKPQDuOgA+mmAYCgfHSIEIM6AUYgZ+1AahHwCKmgFPd6E7q5B8YgIXJABp1jCVOgBfFwDCuAI0sAB0DgCbRACzpwA3uwBzjgB0zAB3xQApxQAHngHw1iCTIwBfEQDzC6t9VQZpVjAjmQAwagpOnKEaW0CDuQlw+iBB/Jon1ZBkpQA2YwATcABHvAAq8wA7EQCxngBmKwCwxAAQUQC0uQAEpwtGwaCd4gB2VABj3QAE+bAsTTKgmxCAiQtbMgBf4wbBylAfWAlhRBFh7/uEvu+qCL5A4xsEe9U4NKcQ1OAAIcULO4Q7CW0AnxAANEIAj8dgB2QAcpQARf4A39YAyS0A+a0AxzYAeTUA9ggASt8AVUoLEyYAmXi7nx8CRIAj2gmxuhO7YMMYdycQBa05+qewlrQgUccAlOMAM2QC2v0A9EIAlBMAMpMAMHAAd9ADGPsANLsAP7gACxoKZzcAVtoAlASgYegLDuKwDj8yxhUQ7J9BPUCwEUcL3+4LVlRADc4A2ekCh0WEEGYVMIZbbMJgUEUAREEAToFBY4BwqSkACm2TKWoAUZ+yQ1cA3UMAoz8AU7MAFHYAOEgAE+kEm8QCfUAAShAAiTgAZq/zAHcfAGoHAvBBvBWiDHU7ACK/AIh6LBGgwtR9oRVrQz/zAB1bA1g0IJl1CzlvIFk3YCFvAFROANlZQ//9AFXfAPd1AJdOIHItAFcQAHaxAMDLC7VwAM36AF/MEBFNsAMHAJPRBB0eKoZBHFU6wD/vAMH3DFd2c0FpF6BcEN1zALFqABETC+LrBIMDQG5AAG/wAKMTACTiAHfpm3GusEFoAHwDDAH2AHbTtFbLAAFlQHYEAOCtAB0EcLKdAPa2ABNsAHdNAAnfA9BHu5WiANNXB6Q6DJS4Gynvx/UIEASkAGcjCzdmvCHAAF5+oHz3gNNFAHn8AcOvMPviAK/5ALG/8ABuZADY4AFVHwBgWgB7d3BUvwqYK5NS/bvD+yR+cQMOlbEJuAAFI8C/xizaWHAOxgoRxhAMzASgSwC32QUEYwxpEWC+6wDjoAl15gxFASxysAAv1gBxrwBdcADVBchAPhAJgwQGCAcyjgANATFp/AYTZwDTHQD0zgCTvgBZ0QwZfbCZ2wAt+QKRid0V7BHAawD0ZMBmRAwoPiJ3t0A0uwBH6AnOylMUlhBJXwD9ngz0MwADozDv3gBG3QBkHsBsYQDGIQDCDwsjVLl9VwCXLAApJ6J3XxCd6QLFD9D1IdfgiQCB0xVo3EAPfQBMZWBFIweKB4AB8ABaLivhGcsVr/IAAz0A/NsARFSDrjcAKSYRNs0AHmTScbUAuROgCrIxC84A2m4glwAAOJjbn02wnSkACnh9GGMLq+RzoCIgkgmdlGXLccoAFRQAM7IAmugAH54yomZzQvIQj+fAYvoBQ3QBdSwAFUUACM4AZXIAkxAAECkGA1IA4eecoOIp920IgCIxWtQwPFXUsTo71mBAzAwGcZsQ0WsFFx0A35wAKG4dXMpgOk9gXqgjtxjAyUsA9BoAlzwARpgAL32hZvIIwCQg5skAuMk0nocAqZEhRgMAtvYA5L8Q+0EAeSAAUs4AdQgLcSHA8oMg8/IALmMASGMASO0OYbUUOM4w/eYMSr/3vKxUIB/wAHAlB22RAGUbB//3AERaibRYAJtuwA5IAEH+4P7LAPeUBEfxAIRHkD/TDYdqAJM1uzLLPMIzC1YAB8TEbclNRL/8DjTGgB6JQR4+BdRD4IDyAZjuBr7Vrd8DYAFsABjG0rDWABklADeyQgCxACBvgPA6AVFeQA2UAQwnAKvEA+MCkg+WMNE9oKAiAJQAAB6hIO8XAioPIF4+AI9B7oYDHoKhsBrXsJma28TlAIIrAGGkBHUTDpC5AL+ucPJ1CE49A6gqDpd8DXb8AF1VEFFSDbpIAAO/AHOLCcGg8HZrCRre602sEF0AM2CKEDGnDrHKbrxqbOGEG93f8XB7iwA3MnEDrADAjASoGlAwPACPAgDcjgBEGAMn6BFOOQAxtgBeTTDnP3EtnA13UNBOH+Ep/A8AZACAcAS1DhAo8ABTdABxygBeFwIo09D/ThCIDuCNyK7y9BAO4Lz0ZMBTIgAAbABeCdP23RFlYQBkgwDjxAUwKRGoJA0HdwB/9wAq4wDnSCABXACBFgBETgBu4gAgKzDTsQATMwAiJes/1JBsbABFZdtQMhBRpQcB+QKV47Xd7ADQf6ECooV0WAC8BAOZZToNxQBO1wUkegB/jwJ8bwBe5ACOWgM+XgD7kgChhEA4w4090+EKrgC+H+E00FPf8wCzrQufnzBlD/4AQsMAeXEsfH0NjxcADkYAD0LlEagRMu8ANUsLykLANQEAWtUAOpUA5+wAc1NEG5ABCYyPkzcMSEv3L/jLz4d4fNv3VH/v1zFKwNFkFuJBXQYW6cARP/xtyyA+cbGQ+XqIBoAAKKgX8HJ86c6c/cEQ0TCMxy8U/Hh1kEPnib4I/mUaRJ/XHjtjPOtENCjHrk8W9PjzUW3KljZ4CWum7YiPwzgKPLv3HjooyrhGHiCSkzOziYSC6HKimL/vnzR02E0U8E/JkgbM6EjRJBnMxIcWmKpSmd4q3wAo2cIwOGjCbl3PnfuTrjhgTzQsmDaTlloJTbAwXUvyglXCHZi85w/9ty/o78HUfOh7x/Du7843XEqI48ehAY2ZeCRMxxB+sUqjfHDp6THjyspEJmxj9DVZUaxalz1rp/R4AS2KbhgIFxnj2LQHBg1qw4WVDVm+hvXLlCRuiEgxq84aYITt6AhBpGACDhFzDiIMQ/tHrZAIkoRDDOqLn2+ocNB8bQy583BjCAoA9ESOsgAzroYCI7frhGAw6mkEELyeYRwAADhgBpnM3kk4+vfyLggAwOtJODAyeQaAWKQv4pJwp/MNDhRHSM6iUMmHQ4YS/f6BLuHxekIOefbbBgxI4iHhEjh+hMIMeABVAgBxRJKJhgBO22A4ElAmATkpqcgjrBAGrWO//AG2YsOIAabWAScqYjmFHnvjgGMaOE/oySRAsZLNEChGC0UmcRQ2j5oI1DAODjBivQiq8DBaJAgpo34lMgGw9VSUPEvRYJ9B8CPolJzhY7+PEfOkaI4AtLQp0insncIQsJ+IKclDMTxlkkARkoSXJJOarg4hsmZOXLn0IQiSIKc/hy8Z9P9NprGQfIGZOXMdAioI0KAmFmBwX8i/cNUTAZh7YqllAHDiq0W8mDMmqoQ9vOBtDAHQIIIKRERTVAwAIESo5gFi+Pwvgfd67ZaRZBArDgn4GMcoUKGXKOTAtjEBADwTdOoEYMRtJIBJA3CPIHnQ2+dIWQvXbdy58X0NH/wd4j4vpkAP/SMgATTA4ibC9JaoAjARshm6yaRUzAFshtPUvnHyK8kIGDJD0g44YSjGklF0MC1+y/QkChEk4kwrDCBmP94WGZO8iRR5h/FqFhIBLa8KaNJehIAzaCwuiAHB54AOMfIHbgQgOU+ryEgyAmPVNjd4IS4Q2hgnJHg6a2cScCBLwZ2Z0jFpGUJlmA4Rg/PVARYmp/ooBCizJ07qQTKB4hAoGtbDBAmw8YIKELKaAG0oEN/NFBm4lQ4PWfHBjKayK/3tgmVxYX6MAQcggbm4kExGAGDbBEGcJhiXhI4wv/GMJaVrat3pjAHP8YgDhKM64ypOAfMTjAP+qU/xYgdascVShEOaJTJUycwBV7MYAohCE5ytlAG/0DACOAcY01GME/5zDABnJBDnKMow51qIoYlqAAAWyBCpSgBJIa8Bq+xGtlQfxHHDYWlDe4QB3r2R034hCH+/iOGxbwhjeAwY1ZfGJC/2iHNy6Fn26gol8myME/KFCGaMkgMsj4xhIE4IndXQNBBhDBAApQAD9o4yBUWkAIeLFCf+BrIiD6x/wMYKIB0AAtc8KEKgZjCJBIsAPL8EQC9rGPLXiBAzdaQTjiEriQxI0mfDGEORxRA7upkgocSEA5NGAGKUWhEihYl2HexYQoAYkcmOiADnLjiA18bnL0QsQ/CHGRCP/swwwY8I8VfBjErhmAHGyQhwbEAAQYoMQ0ZMggbMghRc8QwD2zMNEithiUCfQjC9EghDakQI0BCOUAE7gGM0R2jd9Z4AMdG0AWNHAW/yChBjKonqiQQQYz1GAbE5FCybr3vQNgwQzP+0wONlAmf5xDkv/wVSX1coIj2CBQ8HlDJbLhj8ANwRBy6sApaGMSYPxgCnazhCXmsQSyDCGWspxJdBTiBTIgSSUcuIEranAChIwjB2EIQRDHYZiPIAIS0SOHFSrBhSj8oxSnqKM8PkeDdAGhDcpwwyPccJAThCFf/hlMbxxwAQwQYglcgAAZlthEDjTABmhZl3xmMc963pP/AK8oBgMWgYRuGYAQNtABQGfxgd8BI3gIuKE7AmCH/vzjAF4oQxkec70YxIAIfP2HCF6xjwgUwRdvIMQRMoCNR0ziDR9aBiCo5IOH+EMVdZxfFY7gMX+QAwmYcEA6PrnTf3TAB7lSSwyg4A0PeEG8sJhHOGhgAqUytSbj2OkXKEFRDixpDf+Awg3IArccVKIQ5IiCBLuFBCbwwYF/HS4kLoAOyX3uE0wwQAEyUIEKxOAd/8DABh7SLbSERhUAYEdV8AABEtQgb5S4RDsd+MCZAPED86SGAey5Hm6YkwJG4AQoeDFWExCSF59oxwBmsQ2CMsMbGmDGAXzhAiQYoxOg/7JoA8zwDWMdxD/kkCf31GGDOtjACBX4ARQQ4IcFEKAO/0DuP9KgCo7q5QgTMNY4TrAANvRPgiAhR0//kt4jjCAFULCEeONxjHlogIFLZepgbiKO7oxLDoWYwCOwdaJ1mZWbEhyIrZgggikJky4GRrBbfWKDdTAiFhVYQh8MsAl+9AJ0fOkfJgCwDnLUgUp9KAIFWtcdMjSgmlRCMU3I0R77UGMcNviAIIISAW/Y5wNZ6AYDbmAEHbgAAzAxwRvW4c8BfOAAERCy8ATwDRBwQAvIWMEaoPAATlCJB4ThATneEQsNROAPu9VQEfQwg0c8IAMfgMQy6khJl6rWvuTAQP8YetG/eA3kH7nwgQj66z+61WAOVOjzFI4hDXHIYqcTVG8d5paCnHGAEkrgAFKh0IIS0OAN8TJMOYQRBm5GgRyGABIkmICE3GziAlE4wYH94WkprEMQjPBGLARQAAxcIFb+iYIB6pBfAHxpSgmRAhFCkEQPKCElHICDrOJ2AA1sYxbCpsEHLkWAaxAFC4dQxCBwMQhBFPsG1PDFJk4gCxadgLPU2MYuImABDSwBCjD4RhMEgAFMbOAM5EhHYcwhCgDMwcraqEMo/rCMXwEgD5rogxsGgIm0/sMXxovAXwpuhf7BsjfZOIUj2Askc8hCB3vQswCipYU/r6CDhOl1Z2z/IgsYnKYMlKACFRAhhvmW4wSeOIEUTfjyhwDJqSVABExAcQFV8GEDNJNHHTOphwrMQQNQ8EEYclCz6I0jDfwAQiliEgVZE6QPgiiCaSLGgTIY42Lx+XrYP3CEcfgEswsKwLOAa0AADdieDFAERigCBiiCuBOEATiCd3CBN0gDIRKBRfiERAmyfZCEVxiAd7iADpCTMxEiFFCA3XGDeXOEEgGAMxABCqgCAIiAH+iDL6iBBDQAQcCDfwiBSvicFZEJ1puQ6IgPGtgGHaAbAUiB9wqVTkgGY+ALmWCqqnAHu3mdJYGCKKiBVJgaJLABF4C0tLqDSiiBKfkqozgBGjAA/5jChBAQhbToPgr6hIuogEdQBEw4v83oDWG4gBuACf+QtTdQgAUwAg04AwHggIi5BEd0BQqJG39wB28QO+P4ifuYBWCwAA38BPUAnuDpgwrgBjEogG0oNkFIRV+QAgUgBAPIgWpbh605gLTrB2bAgnM6lImIggW4g2EIHgoQBMqjgT84hVZggj0QAGTQAFf4AjL4gU+AAxrIhUoQJ4MxB3HKhVMQAfAwCkIggAEgBHMwhxv4hhRAmxu5nnCAhpjgOFmyiS+wkSTZpQloBaQajKzSu+EikjsIg4coh7FhFxrQkDtghUpAh3FYrl8bOm9QhkcgBvuKDyL5qwGog3hRJv8MOIUFqCMNIAExyJvXkQFgQAtZarwJqERBkAJ/kAKguA8EuAb+648T+AkL6DYEYIZY4AZ3KIJTVAcCUAcjkIJP2ATMygFr+4RZmAAy0gBgmIA4sIETqIQccAR32AdB8gUREAEgYIAOcIJkYIlmMAMv+IYBGIBlWIC16JY4+QfWwzFD+IeyWyycoiMBWIM1gAXImIIpmIdraEf1+gdZGAFYwJuU6IESIAIKaKqpE4Eq+BIwcYBKwLR3wcdCMJdlqgS0UIUs+bAK8AYiCAYK2AHYWIsokAcAqEggiS4RWAB/pBnV4gYMAIEtOA1KKAMBQILeQwqjGIeT/IMPUMl2aMn/D0AAbiC0ibABCCgAAjgAN3CDVzhARomACXCHU/wAs+sYIHiGTTiDg7C2n+A2RrkGXWiHUgCEOWAGdxAEGvCWIsCHZOgDM0iGJYOFRwAAUYiu1JwyBziFEngXaxqAFgMPiKODH9AAioOMTlCgd6pCWaKGGlGlEjMDJICCKqiFxoy/+DAAF7ABKokPyMTNKHqXRfgAJOgFVnABUFiAKJkBRYgFb4ACMSiHL9AkrXoBADiCOqCzceiAMMiF/PSHRegDdPgCL6ACJYCHS/CAJXzH3dwFb/BNHRgH9QiKoSiKo4iDPMiAn2QARnAHA8gid/iGGvgCIjCja+CGCTgA61yo/7IkgUVYhyEwByRwgXbYBvA8Uw3ArXmjhgDIhB/ogW9gsmmJgK7pKznZzxOogynRgVFYz7E5k39AhxuAAQ1AG73shHloAEHMzaSIgMGEqtdpBRzYgXEgBBfQgU/4BBogBNxUvirAECqRBy6hGROYTDw4Ak64AF2IgwvwAwtYAqLbByjoAxqwg+9IAxsdBnhigzDABGvsDQohAhLYBS8AgSUqAw5Arb/8hzqwgyf9gE8wgeAcBfZINm25hgdgBPDLBAjwwYmYAXKjHg8AAdmSBIMaGelU02IzArp7hrvLsUU4ggOwA2DYhzmgAFtAhQCAAAGghHlYAS2YByqghXXhi/9x4IH9JAQTOoEb4IIx4wsDuINsEIVTEIVlSIAliAE90gJA4wCsghumoodjsBEyuAQ5KIEUQK1ySIhyCBoboAEaKARIcAEmeIOd/Qd5qMZ/MAf/5IJrAAIfAIACAIAb2IEMYAQN2IEYeJ0aEABheIGqIhIkWIBKWLx3isl3EQM4QAR4KD548AAZEM1t/QceQDbf1CQpCAoCYAE6kAVCKAEj4AYzaIJroIBt6AMiEAJe4AURkIQVOIbHxVQBgAI7cARtAAQ7rcnw1Ek1nQV1mMAkOIMe+QVfqABlCABcUAYI6INGMIUEgIEVAIFAWSS++Cuo8QdaiINQyAEQQYFT2AD/HzCCEHABR/gHDRCAJagRll0BMlBJIpElAxCqPkPSJnmEFpCSxuoPQioBF/AEP9ABEUCCOlAFTJgSwqCBFjgAMRCFQqihOegHPYC3NcCGTkCSB6gEIOgX/lKFHt3NOhABQlgEHZACHaABV0AAdBgBRiQ5GTAGiVQvcyAHMLDbD7gcPRCDAWCBFJiDPIiBHxiBBHCCbxiBYNiDPUgBDfCGfmgCJzCGGhDhBGgGY4iAVGgBVwgFJvCEYRgAd7CDkmGGRpFO6lwoIyAFUoiEVciEYsiACciAPiAGVJiBJliCVxiFiYiXjPwSQgACAECBBdiAU0CBEFiEv4DUCaIAU6IE/708hk6whMRMCKZah2oAFTKABw7YgRKIAT6o1ZhEiCkxCv8wABo4giogIVGoBCQwh0VwgVRwh2VggC6ggEywgyXIBAQggjyAADuQBCzQgxoIBZph1gU4AUiogk/QAVStAhqwQPhwhH0wgOQ1UhLrgbOA4780gAO0zkXAAAkYGgEgvG9wghoYgW/4hmqohgRIACAAgjcIBQKyWRCQAye4BQFAg1dAgyBAgw22gyCQgG7uBwnoh2agh1MSmUaZAEYogADIB1RQBAZYTl3Qhxf+AWMwBm7QAVkQBlZQAEyI2lPogOEVJ0iFnsH4h3ORBAJi2TZGAA9hKmhQYy24BHgoA/870IE1gOOB5gsT2lmESKs3gEokKARREIVUOIA4cAVqGNkDgABFeIUfUIR+KDUgWIIGyIMZIIMD6AVX44RQOGUaOAFsCZKK9QYauAbDWqL4+sLU3NY3sACMUAdeaINMGIEfeIAfSIADoIMeGIF6HgEYiAcxaAdfsIEyQIYl6wRkqAYiWCBfGyIFOQFeCIUqCAVPGIMxaOQJ+ABuIAJlOIR8UIR9UIEAIIZRiANFKAYs2AUhAIYaeAQIwAIAUIAJOAIqOYe68Lq9kMjoKoEEoIdviJZjmNn5+ssBsBtsFZcbmAAz4INncAFCIAQRcDoeGKKLgeOEqAMX4BR/wIQiSIX/G2CCbQAAVQCFGsCCGTAFwAuGB5ADS3BEY0iAPriAECiF23GgqTM0KYuPp72BkeuOMriEVshsTu2MUiCZUaADbICBGHgAU9iCH5gDC2iCJhgBMzCDBKgGM3gGIMACS+gEvbSEY/gGIoACVKYBRKABdliHdTgBBffbUqDuNzAAJICEFmiBUNiBYCgGRUgBFUYFOSCGASgCYtCFAjACQLiGIGiFRluCdOGRpusWIIpx9DOKKBCAYPiBnNECvRSA8UYKd5gCUJFoD0AECJiDscWEBViAkfaBU/CBZXiHEAgBoK0CMTzVVAAFJgCAIugCMBgABtCFESADr0aFOZCEPGgA/xkgAzkoMRUIA9rYDECG1DMhEv5zBzyggdNQAiooscSkrW31B0gQgyx4ABjIgwfYgh6IARhogm5uARYIAi6AgxoAgVj4hx2QAYjV8RUwhiXQAFCgBWiwa2gYYClwhVQ4dWuQAlWvh2Go8AFIgQyAAidAgFvAhz5QgQfIgwogACzAAgswxZPcAzXFoQnoAFHYAGTfAFFAARRgJkxQABQgARIIAQwQgBgQABnwApY9hhGAhL/khnCgKIkGgS4gAm0NInTIgTRY9ztwAHl4AUyohEpIcnqPWgqgAD1IASGwAwioBhjAhhFABSzoh2JQARzHP0eEA3hH8iRnplyQBwdgA/+JtwJsQYL4sNMSUALDqk0ZiB2P6PGkiI8oUIRk/oEnMAUQcOEeMAYBMAY0WGwKGLwEWAMzGIHQXl4oCAZrmVs4IIb50wA1WAN8IIYHKIZMeAAKaAM8KAA4GAVm4LeJ+IQlIAB0QAIrsIJeyPpeEAZhaHcHyIVc6IBs8C4oEK8peFwQsBemuoZ4uJtLoIQe4IM1YAHsTbHOSHd2d4hTOIVK2IBKCANFQAUQqIYfCABFYIZiWAPTyBkZgAFP4C8kKFE2KAEQ+foOAJuGR/IO2AVmIIQGIL49b6ePn1ujQAQB6IFkNoUf+IYeEIAGcIImMIYmYIIZgAEnWIJqUAJsgAL/SmhjLViBL1iCDorxQisARaCAA7AASSCCHcAGFUCFCjgEYmCELBADXXjOxYK/f7CBRwDlge6MM9kBaxcvAD8GKlB7WQKGxyiD0xgBJPiCPfgMd5ylpACidJidPcCBQoCDCQCIHw+OkXlwKY+tPnSo/ODQgAiNf+PG+aNI7iI5f+T+caw4LkqaHAMQvIFBhoqHS2VS/DNHkSPMmDJn+qtJ4dsIChIe3Yrxwwk2J3J6CBDgxNgaKdgS0KE0RYulKceCLdn2D+PMrDFNAACQQQMCC/uYmcGmIhO+L6hsFclwY1fEiVH+3fBWs2PNvOb2mkv3b4eAL15kWDq2gowOrYo5/16bIqPMJUo9kHzZ829uzLuZ87asacATIgAXspmhQkZLJxgg5BzqQ0TJsUdcXPwzUXPjv7x5J+YtF2XjAG9IRpBR4oGDDEmdFzPPjSTFCCguZqSAAiWGMRg9tje45ARCDURYYPw41mnK03j0iHy4erG5zHFuMpiJsMsdkX3XevbQUkyDLe7oIsgui5hA0V3epKIYX339JUAMg1nSyTFeJAafTNfEY0kZHkhmxRcU1OYeRu9dJZM/55RTEyd6+CDMBRY08IMXIFASQw8jeMMCCB4EIYUN/phgAl8e6fYSR+QM+c9IBhBHBUpl9FMbkhjKRI4LMcCQxw0p2DFHMQ0MNf9CDXKAMIITUPzAhSAw1CCVY6j1AQEeHFWZJFYwaQSTBooAgIN9zGgAATAzHIUKQgzocoAFiIxTjm9zfXBNbprBxBc5PPyzhgBQeOHFFJ0g40VE/ljJETfhlAEZJQ2csAQdL1SywAKYdPCCKvLomo082fiaDRvBWmHFAhe8I8gFIXwizg/YgCADCGSAMIALEzTRyg3rCJlXRnfpphk55pjwDwEIDGESFfAgN0dnpp6qJzk2xDDCN05IMoE3xcAgxyNONPBNNTDssIMTTdDhpgzHxLlCH1h4QwMQooiCAsUVV2yrrR1ojIkoKRCjSwTXuLMLArHEMgcCUMCACiN6uHH/wARA2ABpDlGgYwMW/qCz87c671VHFDFAIcCnU6wgDQe85PbuAbDIwMEl8MhRiEJI/NJLL2mkIYwwd7DhwK8ad7CAxvzwQ+sFrJyCSRjBhMMBJWTIoMQOoLwRxR5BsADGORqVmGdW7+FhASHVUCKHEkpwQEdu474L00WfrAGDoT00scYPDRjzjTE9YFNNH7FMsEaO3yQgw3lRrVCMGMAQUgIbWMs+++zBYgCELiEgEoTL2+wSATexeDOHEwIIpEgB7kSQASaVnCIKJrRWosustFpvfSUSo8DFD18YU/TRDThi27sDiMMB1FTI4QozElxlUYknZkbOG9FbQU4up/jh/woG7kywBAg44AUYiAECFFiGDy6gC10AQAFiy0UuVCHBCUrQAap4AQYlmAM7TGAR8Dich8oAh5Zg5nHuscEXQOCOP8DgX0OLATZwcqMJWAAHQaDDCGAABQ6sQAsy0MI88vCHfXCkb1qJHxioAYAX/OMNkjBDGABwDTt8oQZQeIQxBNCPJvjpAG4AQBjYoAAugIIHdTjBPiDBAwOwsY0GQMIb4giGKvyACDWQAaiOVgMluctKNBCHF+BGhUu0ohVN+IchMOOunm1kHCHYQAfYkIYFsCIMp7gAJg8QikIQgQ46cEABXLEAAFBAD/wYGwocoMpVfk2V2ciFryAYAgUsA/8DzCCAFCjhAeOQ4RKzWI4J3UMIFYAAAS7AxgNGYIwfMMINfajGFh6QAjykAg1VCEY1duCB1FkCGdgwQjAM4BG8jLOP0CgCAIDgCi4UoEsa0IMiElCDRwQjPwJYwizccIQIDIAGPgDAKS6JCWFUgV16WuTSOJKKBOzjG4TRwtEegcg+YogQMBgMJRQXhCpAIQqJrBRFx4GEXrAhF2FgRfVYsQA2WKEELTiFHlxRhTDAwQ7ncEAG4gAKUIyBCR0AAAoqgYJe+A1w8qsUD8ghiU8cwAtKgJIHqHCEhAaTHBMRAwwEUI5irGFeDyhADEyxBRg8AAGccAcLXPADJRwABiv/mIIlZLACGLSjGIuQSEX66A8DEMIFnxiDIPQgCinQwgWsYKIOzIAGMYghDhyJwjiOIAAE7IMb1LDTApYhBRIAgAEFKEAkc5ADU6noNne5iSSqYQlLoGYezJjouwwgAA6U4SQcaAISoFCFJK1xpLm4FcdEwQp+qMIKUYhCreqgkSiUYIEUuMANuhKHXOiCBV04Am3+8YJllCB/G3iBA9KADhNVqiPjYGMw3qABp1KBEgOkjakoeqqMjAMIP4ABEGLghBgUowJ9WCs8enAUKGhiDt5QgjFcAIVO+DBhHGhHLH7JEQOI4ATakAIXjnAEHXCBAqcQxkWswI8XWBUJxrhG/x2GEQd3eAISkPAEAoIhgPa8xACYcMBlILEECpAggaJYgCrSANmlmUoDP1iDe1m7ghW44x/pkG9zzBGMTuBRCWSogTmWsAcMaEwUG1jACzqQCzbkAAOV6AASUlSHSmCCHAYYx4Fy0BUAkAANftjADE5BgQNwQQRw/gc6MEGCOsyRBMAFrxX81pFKfYIe5qARlExTgzpQNZjjEoEkYBAdMewgD1gIBgRggKMRpKQHxkhAA4DxD0kcI64/PEYRDnANQrSDGgOgxhE+sQg+vAEMJLiAKvLCBlaoggcVKYEXHgEIWlyDCjDAwRwa8AgEfEEblfqIASrhAH9w0AU6OMEbqv/AiWUEFAXgzcE/kFAUKJRhMKEKxyf4+LhrwCKQgwTBIq4hAQxgQpJIMMF7DKCAMJpxHG8IQwd4AGcDmIAHd0gbENwxiyqEoCsFiIMIamIbfyBB0MoVQShO4NsXYALR48CKHYxpZSooQSU7wEswzfsPQBjjEt9gwwRU4A1lxKAaa3ACEb5xjU30AR41EME/4BDXwcBiHhr4xBJsYIN1+FlPhACAKNJgVXKwgR8OsGpNEGGJBqSgGU4gQ70aAAUrfmEAeoLJAjIwh3GdIBV3/cc53kAIG/gigRu4AQyW4IRAhmoFDRhCX6C8mI1QYwuPuYTiDpCEGJRjIxe5zSZGDHD/ihgAkhvZ+G9ewApMCAIIJoijKtR2gxLg1VTkyEElHFUOJNCgCpQ+hxVK2rwOOMAK/4jBDW7gBZYPkgMjjPlmzhuEEYgjD7qAABEgQKZ99OAbsxgHESjxjSMY4B+I8IAM8OiFFdTgDBqwQW6i4A/180ABF8jFxslxB1Zkg4/jYNJgQDChR0CCGxHgww/UwDeAgAAAww24AA0QADBIgh6wATkYgj+8gRToABKk38kZwjqUQArAQJh4wRZIhTRAQW04jpVohDM0QFxxQMs1AToIACKA1D+IQFARVW2QgxVsQP1NBEipwgUUQiXsQppRRDlUgmYNwETcX26QQxqEQRVE/4FvIKAIlEOS+IMVOMALLAAX1IABSAIHQJUHgMCFIB9e3B8fWMDpJMCnFUM1KIACgIAK3EACwMMPDIA4/YMBJEAnBBIsTAEHfIIYTED6zQUh+IAo3E8d2IYD8AMGuJmQdJ8YaEE4DMAESEIFwkQrUAAUUIE4UEE1LME+IMA2iNwGsMFlfIQNuMIJXEYd8IAh5IZ1BIN7wYJ5HAM3jODj+EOWcUhxeEAPlAAWsMS48MAjqcLJwRk59MIGLKIJvFledIAlncAF+IId2gY5yMMFuIDMUBpMQJYwhEGQQAof0AAoQJYTakRNRIAG/INJPBUllIETlBDy1QRF3B8PXMOWEP/BD6AaEQTDCDSAElSDJEgBRQDcP2hA+AlQPMxDBHwCBKjfOdRBCJxCNpijqWQDK/RCbcjjPxACEaRGHaQCEBgAOf7DI3kCBRAABXBB9yWJIfRCGJWiP4jAEdAA+5mKH4xAWRRNPKwAB9wV+bwLpbnDFJQB3IDAJcBBCDgBH2zkl+XA5wFc1zkgb9wfOSyAKOTAAijRJpwXkZCDKvADCuhAFwQJTHyE/G2AC6xfFNSBNtAAEqif+kHKF0jBAHgBJUDVSlRazCGIkGhKLKgAFCTANwgQFTRAVh3A3THjP3ABB/ChFzRdAliBN3BCDBKiFRjbRHjlRYKUqbgANeyANAj/QBzogCvYBpz5Qwj4ACLYAOwsg3JtnCEc4wbcjxNehg4MACGQA6WZQQ1oQDUI0BQkZA203i36wyIMpheQgRzIARSUAxRQgANIZDoc13GRAwbwg1Te3zxiwgaMwx0AADVUQmIY0T9oTCXcQBTYQCGUw/310R1sACS03jp8wjoAmqlwggguwfCBABVwgDi4nRhmxSqaAAQEQw3kozFckd4QgrvwxbhEwZsIECzEwzEAgSBYgDBI5Psg4QtcQG7uFcP9Ay98wBtM2RJMgD8cgW78gwPRACd0ADpklnJVp6mcQRgk2sb9gwvEQURUwTdowBqQARlYQjhIRZPpJYYIyT8o/0M8yAAZeICZcIEfGEMupEE6JBLQ4M8G9IJVIYhVZQ8Y+IM8FIABLEBizGN5boIwAMAb+EMVFAJkISFHyIMoVOCfvYEOfMKb/QUclEB7sdxx1MAbBGhW1MQn5MEX5GMxuIAfrJgduMMkxMEYQAIYmIgFpGD4zUMM5MAjUMD90NdFcCeD3t8y/sMibEN8GoMHzAEBkMMwdAtHGFodAMEG2MwCDJpvIMg/YEAYVCBnGIAfuABvzgBxDEbCiAMhxGNL+EJ/PqkcXMIa/MMXsMBl+EOWmtT9HEheoEMYoIAZ/cMGKMA/VMIzlOU/YMImjGsHrF8VoJ+c1sQLiIJyvcQ4LP/CESCBFNSAPxBBjSgBJXBAOFgAkgbouOzCFwgANghAEcAED0ACLwCCEBwAC9gBC8RBP+mAEqzWD3UCLFDDHqQjX/oDJpyCOAnJn9nANiQrBdwlC4wCOVxWTDiQjgIAOhzXArzDnprK/TlAnV7b/QFBA2BBHwjp0q1AOiLfQJpDDHRC+igBCIQAFwiA+j0KOXTABjjlkGSmAfBDCBjbP3wCAyTaApSrOeDGAmDAP2zCBVgBe9JAfeoJe76At57I/Z2ALAiAGJTAB/Fne4FhtRJqZphAH+TBD0BBMCyiPxgbbnDEG/ACXU7ANRzAEmiCAHwDFYyfC/bBVN0fOlTCBQz/Kl/qaCj+QwTg0RQIgB2AAYDChAJkw2WIAgZESiWQwDnglbj8gwOEwaDGlz/A0C4gZ1xpwRRIgRgKybh8QCBdAhWAAAhE6xowjgnUwQKEwZvZxpAoYRiEADnMxToYwQIoF7m2BBLC7j+cgA+8AKSMAw2cgEYiiK30jQkYwrhQgAD8BQcwb8txAD2c3E8W76KRQB4gbAxAwOVpZHnFBP18QAIYgyZogiQsgTEwyhJQKhI4DxhcxV6MSy38QbIOBxnAAGHMwRsAAgKTQC7UxAIAwd2MQ+cOmkREwZJkgw+IU+1SwAi4ASzKzRSEQzyIoOKZkD8IwNPsklFOwAmMABf4/8MGVEIdyC9v8EAv8IPrOqEBDEAItNm4pmtCkS8kIMKNNU4VnECu4kaMKgCcGcI4nIATcNiTMq8HkEEPlIo5AK5EIGEGBHAMCIAgDCxNmMMb1EAnvM1JiIMA7IEFzEErKEoc+EE9dIEIvAE5nMAAIN0/dAF/1gAHWMIozBwCL8NEnqtmQco/wB4KfMRxUaPVQjIoJIAGWEA1kAHTTQEsHAF5Bag7fIoumUkCnMAEGAMmYMIRmizX8cMmWNVccMEY5IICmEoloG1MhMFdVTEbVIITfkQYV1oOZK+S7gBL1EC/+islsARHzDGh3sZGFgMMXYcIZERzaBy5DManTAgy0P9BOWiALgABLVjDNkCqHbwCDlBsCzBBKaRCh6iGJSTAAazuVSzD1/3Db9FAWlJENivAcW0LwHUACvjDFzynAAgpqLgXFCTuDz/OMkbIkxamHJjBP5iBSlf0kPhDIi7im5UDDdyAyN6BplTC3S1NGMAXEPCBKqwrRUQBIqTipfhDDnDtP8zAcKaADEDJs5bBCARJewJuHw1AopoCDKTj4i6GkUirDwkQ6lhIFQhAKMREHbxBC7gDIODAJAjBK7CAMdyvODQAB8DAOyCwD3ydP7DBC0QB97EnUmdvHYgTPRpAGphBAhRBHxhHGchAOFiCOIxBpoz0u4xLLkHNLm0HBQT/8QjBsEZEZwl0qQlAwii8Qeel2bi6611UglF/QglEQSWQIud9glHnxl4IwwvswQgsgvDdZY9cwiUIrEWQc4C6nj8AAzbAgKb5QbesaKEeyP19nw95wWohwzcgwQAQAdKNA6W5wOg+lgiMwqlKgjusAyTUAvFCjg/cQUb0AgroqA6o5Thks/biYuL+gx3AAAW4AX8ihxZwQCeomhl1dTyOizdAzSV8YQ/IQSqcQU4gUjpYIyQY7zIOADv8A7G8RCWgH+9WQrKaqrVNM2SZSh18wlKecvfpQAO4QgnYNfMGkBcYg2LScW2cABh0ARFUA4/TA270r1ZANzBQmelqATLk/4E5UIAZdN842IA70MaQzMUAJIYBJMZFlAIJs7d7p9sGrHhaqh9Sb4D2GkL3TcA3UEARJEB7BWc4HMMPIBTgToQ5EMI3DJ8HwEMLJUAhfIITtMI/ZMMFQMJHvIQUTJU/bAImLI1O68k4YMLuisAnXAUmqEJCIcERsG8UrPgIuEMUzNZTyYEHfCHxWgrg2kAEMEMzaILQGMMjSIIdqMNKnkoU/EAnWIK7dcIK7IM5XIMkUNh5U4n6JWBNuEA7uMc6rHeStHelLEAFIgE1BGHi5sAGbMJcUAAMuAMQ1ECPgMoUkEE4wKyNd8S4DEADPKkHBIwcGAMfIIITsEAJvMF5ff/EP2jDLIQoCuQCTJCvt2BC90VgYnBcJaRBH50AJ2TcYjbACEFBcSxvy3kBpRiCOVh2MFFDP/SDJOzDfSyBALiDDtQhhkS8ObgCJbiadUMUAuz6EvgC0h2ISIoAHlAyNfy7fOu1MCxNJN3fKWqcd0t7L8zANxwAJwgACCiBde+wJVCKxAeTkLQiN3hBqC9vC9WA1DkB4yz96aVsXy7AHcBEM4NUjDKjAUhByTpAol+EbZxAYuBBA9yAtKog86IEBzzCeUFg0j8ONUwuBdyAL/yBELDAoBKJlYhL97nDDz2N46EGAvzDAcRApDeOPxDAJ9wFAdSnqSxC43fEiyRhB5D/QLVygQ0oCflYQR7UwJRDAfMWvRfEwxdUdrjrCcOZAD14gTjIASWAgGrUQCH0AhSYQQUagiFIasRH4AagQxJ2/dJ8/V3oANKh8LbtBfFHQbQBQRR8gbQM/bN6QQLAFzvbeMSX7wdkFzVYgLXdSZTp6hwQuRdEtiXEQx+gAxesgYi0BF1mZBXHuuXTvM0vwyj7gywAxABHPMr90wElzyZONZSAKGPJ0pQVxt78M/EPY0aNGzl27OjP3BsBXqh4oKKkQTUnfv5pEMAyxAATJvz9cyGqJsYFhP7VHJdmwbh/Qj+ty0goTI6Z/2gIEABqUQ0y1UCcJONhhI6eHrl29WqC/5w/A/6EejX7ZcUUDl5kkJGxAooVDMUkFfpH4M24cf5ODCCLcdEnjf5OCetJ7o6ovXt1kPhXbsaIFDkIfINHha0lDuEauBi612xojv5yXlwXA5YSOSapNhDz7waUFIj+5TAn9B2mf+R09iInlFwa3TlpCP6roMO/KHRgzPnXqgGlqg09eGnA0h9v0dszku5Z8+L3nNw3RoFyjJIX9WW0rBgB5N+BLylA7QbD9MhWpu0Gn0pzOIdTHDGhjjr+IYGCGGLgxB86egABHg5k8CKcFcTJj6yyyBMNPBMM+eeEHyihQg45lKimATma4MMfBIzZYzwgVMEouwVkIS27XkSxCP+jdaT4DiMd9nDCGNq8IYOK6UBIr5oDLPJuQw79uYg0E0CDMsop/zHgi2PCUc8LiDopI4UoTtBAEzsgwagdGvTT5seMxrngP9LQOUWWdB7zAwonKPBHgS9AaEAJCb3gABYQqPlsnPCi3I403rQRYAoSlYAHhB5G8PMfG9RQY5JSyFngjt/2WsCKxfzRkRwe/CnnjfwwQsIdp/b4B4gfyGhIiYaWpGKUz8x5lMPuxiN2MIwMWKMTiMKRASKJRsDjH3a8WYIFJpgwxBxzagqsnL3SMeSUX7xF5x9MfkmEBQluceecXiBoAAQQyFiLAzLigQEa/ZAl1pFgDj2pJBgSaAD/ihv88SQINdDYo4uMzEHVHx5MMIcNUVrVjg8+/DBDgDVuMOgRJagglOBLvPiGgH9dfnkjA5ZYARaIbJZoihhYguQVd+MIpZQeXejWnItEKegfHhJpxV0JhDDEGW5qAKEaKgylcIUEPLMS5g0vMkGDcMRJUgkPQPhmhBFiGJmHONSQIIhWUikhGwM0MueM3UpZB48dahBgBrt0WAIEs02u6l4yajCu68b/vYaDFdiCFtopjrFEgAPsroeFT9EQggUhAGmhBU9w0IUOMz6VQA0hujAnBCx+OAmEtcKEZYp4vjAKNMc5nGlYbmAIZ7qTDE7gmwciqOIfj1mgIwUE5ngl/w4c4piEhVfQQKAfb+BgXgQ8vqiaapOpKOleInhayvf2ORRqABiapZxyS46ZAgQViljHBEhaEAINn7pFM5oBBWXsAxhCoIUzhpCEDDyAUIWT0IQsIQMvXQMjVsKS+7gyJZAYRADi4AAITAYPeFQjbT1wwhciQI285YAPhfBEC/xQwxbQAhSQKJAO4LCEEdSLXr0yGSXI4IUEuCODXOPgEj1Clpqc4Aud0AJE1FM5WGjhfiCoAQSK8Iwh5GAIvxjCEEwwxjNwYgZr+EE1LiEHe01uQrA4xjx+ICscHYuJXRGKCSywJC+MyHwoQlsDYPCDPJhhBhQYgBQQoQBOAIECM/8wQx5qEEQUVeV8JlmLOJbgma1sMI+h1Mg4DgCDecQjHuFQJSxwx8rcXY4MDfjGD7DhFAHU4BsNqA4ZrkKJtYSDleqJxzzE4Q27+UuUZplJTWggsENRgle+IuQIfjCCBkxzBN/owTZh0E0YXLNslzmf1e41gglgpHfJVGd3MPIGBFBhHrmbgiqBOQV7wkIG+azg5NRDBl9ywFAyACYsvCDHFXBgCW5aJ3ca1SiMUOMLRURS8S51omrAYAQJQF4C0jaCb5KQCib0gAeI+EsYXGN9BtDQQtfJvnUAowErWAEqWQkLVU7BEl+a0ATz2VPcWeJ2BV3BMZSgAcF8Bo8s7Yj/XvZiiLIcQRLVCMe9KOGBXp1PiOPM6lVLQsSr9DQBETgBOmdCE6Wu04k5eQM3EjCFeRzjfqy0RM1sOiF9+hR3qLTECk7ZAGDwxCLpPGsHP4kjwCBAKgWdKgdGasKQilOkHuDl5LTAgQZ8YQLj8RZpBDtYJhbtYhsZgCQS4AXL3c+ec61gtFYbj2PINC0NWMIsPjQYHI3DAAbQYFJZytm94NEEUojAF0ZAidXCYguH8sJk2WLaKSx3BEvYhQ5EYIATrOMEhBDBG1TKW8+6r1smyO14j/kGa0TgESMQB4WAGY4p4A6urx0q8TTBjQHQAhpS0K8UdECDRawDu9sdrxIH7UsW8b7hDSIgxHUXYQMb0MDB1JjAPgQAgyKiEq40DQclYFADekTgA1L4BDT8Swjt5na33xVleA2AYAQr+AQxXgQNBjABBEhiCQqCgo6h8IVg0IMZr5gFNY4AiCOM4RM0oIE2bLAO7o73t4ZVcU8aJd4Wm/gELliENmiAXylQYxbbcIc7PvABAgxgANYYAzsS8YawaAedGvrtlENJNDjLqUplTceeydEts/DmzsaiEZX1QufRNI43eJSyoT/7ERoZlhyR3gjRhmXb7Ax60Hdk9KY53enRLNrToRb1qEldalOfGtWpVvWqWd1qVzMxIAA7",
                                            "isMetaFile": false,
                                            "width": 135,
                                            "height": 83.81252,
                                            "iscrop": false,
                                            "name": "Picture 3",
                                            "visible": true,
                                            "widthScale": 75,
                                            "heightScale": 75.000015,
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 1
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
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "left": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "right": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "bottom": {
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
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "vertical": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                }
                             },
                             "gridBefore": 0,
                             "gridAfter": 0
                          }
                       },
                       {
                          "cells": [
                             {
                                "blocks": [
                                   {
                                      "paragraphFormat": {
                                         "textAlignment": "Center",
                                         "beforeSpacing": 6,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {},
                                            "imageString": "data:image/gif;base64,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",
                                            "isMetaFile": false,
                                            "width": 165.6,
                                            "height": 102.81,
                                            "iscrop": false,
                                            "name": "Picture 4",
                                            "visible": true,
                                            "widthScale": 92,
                                            "heightScale": 92,
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 0
                             },
                             {
                                "blocks": [
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "beforeSpacing": 6,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontFamily": "Calibri",
                                               "fontFamilyBidi": "Calibri"
                                            },
                                            "text": "Road-150 "
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Product No: BK-R93R-44"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Size: 44"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Weight: 14"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "leftIndent": 36,
                                         "afterSpacing": 0,
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Normal",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontSize": 12,
                                         "fontColor": "empty",
                                         "fontSizeBidi": 12
                                      },
                                      "inlines": [
                                         {
                                            "characterFormat": {
                                               "fontSize": 12,
                                               "fontColor": "empty",
                                               "fontSizeBidi": 12
                                            },
                                            "text": "Price: $3,578.27"
                                         }
                                      ]
                                   },
                                   {
                                      "paragraphFormat": {
                                         "lineSpacing": 1,
                                         "lineSpacingType": "Multiple",
                                         "styleName": "Heading 1",
                                         "listFormat": {}
                                      },
                                      "characterFormat": {
                                         "fontFamily": "Calibri",
                                         "fontFamilyBidi": "Calibri"
                                      },
                                      "inlines": []
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
                                   "shading": {
                                      "backgroundColor": "empty",
                                      "foregroundColor": "empty",
                                      "textureStyle": "TextureNone"
                                   },
                                   "preferredWidth": 234,
                                   "preferredWidthType": "Point",
                                   "cellWidth": 234,
                                   "columnSpan": 1,
                                   "rowSpan": 1,
                                   "verticalAlignment": "Top"
                                },
                                "columnIndex": 1
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
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "left": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "right": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "bottom": {
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
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                },
                                "vertical": {
                                   "hasNoneStyle": false,
                                   "lineStyle": "Single",
                                   "lineWidth": 0.5
                                }
                             },
                             "gridBefore": 0,
                             "gridAfter": 0
                          }
                       }
                    ],
                    "grid": [
                       234,
                       234
                    ],
                    "tableFormat": {
                       "borders": {
                          "top": {
                             "hasNoneStyle": false,
                             "lineStyle": "Single",
                             "lineWidth": 0.5
                          },
                          "left": {
                             "hasNoneStyle": false,
                             "lineStyle": "Single",
                             "lineWidth": 0.5
                          },
                          "right": {
                             "hasNoneStyle": false,
                             "lineStyle": "Single",
                             "lineWidth": 0.5
                          },
                          "bottom": {
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
                             "hasNoneStyle": false,
                             "lineStyle": "Single",
                             "lineWidth": 0.5
                          },
                          "vertical": {
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
                    "columnCount": 2
                 },
                 {
                    "paragraphFormat": {
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontColor": "empty"
                    },
                    "inlines": []
                 },
                 {
                    "paragraphFormat": {
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontColor": "empty"
                    },
                    "inlines": []
                 },
                 {
                    "paragraphFormat": {
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontColor": "empty"
                    },
                    "inlines": []
                 },
                 {
                    "paragraphFormat": {
                       "styleName": "Normal",
                       "listFormat": {}
                    },
                    "characterFormat": {
                       "fontColor": "empty"
                    },
                    "inlines": []
                 }
              ],
              "headersFooters": {
                 "header": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
                       }
                    ]
                 },
                 "footer": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
                       }
                    ]
                 },
                 "evenHeader": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
                       }
                    ]
                 },
                 "evenFooter": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
                       }
                    ]
                 },
                 "firstPageHeader": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
                       }
                    ]
                 },
                 "firstPageFooter": {
                    "blocks": [
                       {
                          "paragraphFormat": {
                             "styleName": "Normal",
                             "listFormat": {}
                          },
                          "characterFormat": {
                             "fontColor": "empty"
                          },
                          "inlines": []
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
           "fontColor": "empty",
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
           "lineSpacing": 1.0791667,
           "lineSpacingType": "Multiple",
           "listFormat": {},
           "bidi": false
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
        "styles": [
           {
              "name": "Normal",
              "type": "Paragraph",
              "paragraphFormat": {
                 "lineSpacing": 1.15,
                 "lineSpacingType": "Multiple",
                 "listFormat": {}
              },
              "characterFormat": {
                 "fontFamily": "Calibri",
                 "fontColor": "empty",
                 "fontFamilyBidi": "Calibri"
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
                 "listFormat": {}
              },
              "characterFormat": {
                 "fontSize": 16,
                 "fontFamily": "Calibri Light",
                 "fontColor": "#2E74B5FF",
                 "fontSizeBidi": 16,
                 "fontFamilyBidi": "Calibri Light"
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
                 "fontColor": "#2E74B5FF",
                 "fontSizeBidi": 16,
                 "fontFamilyBidi": "Calibri Light"
              },
              "basedOn": "Default Paragraph Font"
           },
           {
              "name": "Default Paragraph Font",
              "type": "Character",
              "characterFormat": {
                 "fontColor": "empty"
              }
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
                 "lineSpacing": 1.0791667,
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
                 "lineSpacing": 1.0791667,
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
                 "lineSpacing": 1.0791667,
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
                 "lineSpacing": 1.0791667,
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
                 "lineSpacing": 1.0791667,
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
                 "characterFormat": {
                    "fontColor": "empty"
                 },
                 "inlines": [
                    {
                       "characterFormat": {
                          "fontColor": "empty"
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
                    "listFormat": {}
                 },
                 "characterFormat": {
                    "fontColor": "empty"
                 },
                 "inlines": [
                    {
                       "characterFormat": {
                          "fontColor": "empty"
                       },
                       "text": "\u0004"
                    }
                 ]
              }
           ],
           "continuationNotice": [
              {
                 "paragraphFormat": {
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
                 "characterFormat": {
                    "fontColor": "empty"
                 },
                 "inlines": [
                    {
                       "characterFormat": {
                          "fontColor": "empty"
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
                    "listFormat": {}
                 },
                 "characterFormat": {
                    "fontColor": "empty"
                 },
                 "inlines": [
                    {
                       "characterFormat": {
                          "fontColor": "empty"
                       },
                       "text": "\u0004"
                    }
                 ]
              }
           ],
           "continuationNotice": [
              {
                 "paragraphFormat": {
                    "listFormat": {}
                 },
                 "characterFormat": {},
                 "inlines": []
              }
           ]
        }
};
describe('Margin center', () => {
   let editor: DocumentEditor = undefined;
   beforeAll(() => {
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor)
      editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
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
   it('weblayout center margin', () => {
     editor.open(JSON.stringify(doc1));
     let x = (editor.documentHelper.viewer.clientArea.width / 2) - (editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[0].width / 2);
     let y = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[0].x;
     expect(x).toEqual(y);
   });
   });
let doc2 : any ={
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
                   "beforeSpacing": 18,
                   "afterSpacing": 30,
                   "styleName": "Heading 1",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 18,
                   "fontFamily": "Calibri",
                   "fontSizeBidi": 18,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Calibri",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Adventure Works Cycles"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "afterSpacing": 6,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 12,
                   "fontColor": "empty",
                   "fontSizeBidi": 12
                },
                "inlines": [
                   {
                      "characterFormat": {},
                      "shapeId": 1,
                      "name": "Text Box 5",
                      "visible": true,
                      "width": 99.36,
                      "height": 38.16,
                      "widthScale": 100,
                      "heightScale": 100,
                      "verticalPosition": 34.55,
                      "verticalOrigin": "Paragraph",
                      "verticalAlignment": "None",
                      "verticalRelativePercent": -3.4028235E38,
                      "horizontalPosition": 0,
                      "horizontalOrigin": "Margin",
                      "horizontalAlignment": "Left",
                      "horizontalRelativePercent": -3.4028235E38,
                      "zOrderPosition": 251659264,
                      "allowOverlap": true,
                      "textWrappingStyle": "Square",
                      "textWrappingType": "Both",
                      "distanceBottom": 0,
                      "distanceLeft": 9,
                      "distanceRight": 9,
                      "distanceTop": 0,
                      "layoutInCell": true,
                      "lockAnchor": false,
                      "autoShapeType": "Rectangle",
                      "fillFormat": {
                         "color": "#FFFFFFFF"
                      },
                      "lineFormat": {
                         "lineFormatType": "Solid",
                         "color": "#000000FF",
                         "weight": 1,
                         "lineStyle": "Solid",
                         "line": true
                      },
                      "textFrame": {
                         "textVerticalAlignment": "Top",
                         "leftMargin": 1.70858,
                         "rightMargin": 1.70858,
                         "topMargin": 0.85429,
                         "bottomMargin": 0.85429,
                         "blocks": [
                            {
                               "paragraphFormat": {
                                  "styleName": "Normal",
                                  "listFormat": {}
                               },
                               "characterFormat": {
                                  "fontColor": "empty"
                               },
                               "inlines": [
                                  {
                                     "characterFormat": {
                                        "fontSize": 12,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 12
                                     },
                                     "text": "Adventure Works "
                                  },
                                  {
                                     "characterFormat": {
                                        "fontSize": 12,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 12
                                     },
                                     "text": "Cycles"
                                  }
                               ]
                            }
                         ]
                      }
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Adventure Works Cycles, the fictitious company on which the Adventure Works sample "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "databases are based, is a large, multinational manufacturing company. The company "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "manufactures and sells metal and composite bicycles to North American, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "European"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " and Asian commercial markets. While its base operation "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "located in"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " Bothell, Washington with 290 employees, several regional sales "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "teams are located throughout their market base."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "afterSpacing": 6,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 12,
                   "fontColor": "empty",
                   "fontSizeBidi": 12
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "In 2000, Adventure Works Cycles bought a small manufacturing plant, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Importadores"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Neptuno, located in Mexico. Import"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "adores Neptuno manufactures several critical "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "subcomponents for the Adventure Works Cycles product line. These subcomponents are "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "shipped to the Bothell location for final product assembly. In 2001, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Importadores"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " Neptuno, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "became the sole manufacturer and distributor of the touring bicycle product group."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Heading 1",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontFamily": "Calibri",
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Product Overview"
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
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "afterSpacing": 0,
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 142.2,
                                        "height": 88.28252,
                                        "iscrop": false,
                                        "name": "Picture 2",
                                        "visible": true,
                                        "widthScale": 79,
                                        "heightScale": 79.000015,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Mountain-200"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-M68B-38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 25"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $2,294.99"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   },
                   {
                      "cells": [
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Mountain-300 "
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-M47B-38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 35"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 22"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $1,079.99"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 135,
                                        "height": 83.81252,
                                        "iscrop": false,
                                        "name": "Picture 3",
                                        "visible": true,
                                        "widthScale": 75,
                                        "heightScale": 75.000015,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   },
                   {
                      "cells": [
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 165.6,
                                        "height": 102.81,
                                        "iscrop": false,
                                        "name": "Picture 4",
                                        "visible": true,
                                        "widthScale": 92,
                                        "heightScale": 92,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Road-150 "
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-R93R-44"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 44"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 14"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $3,578.27"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   }
                ],
                "grid": [
                   234,
                   234
                ],
                "tableFormat": {
                   "borders": {
                      "top": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "left": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "right": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "bottom": {
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
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "vertical": {
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
                "columnCount": 2
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "empty"
                },
                "inlines": []
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "empty"
                },
                "inlines": []
             }
          ],
          "headersFooters": {
             "header": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "footer": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "evenHeader": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "evenFooter": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "firstPageHeader": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "firstPageFooter": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
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
       "fontFamily": "Times New Roman",
       "underline": "None",
       "strikethrough": "None",
       "baselineAlignment": "Normal",
       "highlightColor": "NoColor",
       "fontColor": "empty",
       "boldBidi": false,
       "italicBidi": false,
       "fontSizeBidi": 11,
       "fontFamilyBidi": "Times New Roman",
       "allCaps": false
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
       "listFormat": {},
       "bidi": false
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
    "styles": [
       {
          "name": "Normal",
          "type": "Paragraph",
          "paragraphFormat": {
             "afterSpacing": 8,
             "lineSpacing": 1.15,
             "lineSpacingType": "Multiple",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri",
             "fontColor": "empty",
             "fontFamilyBidi": "Calibri"
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
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 16,
             "fontFamily": "Calibri Light",
             "fontColor": "#2E74B5FF",
             "fontSizeBidi": 16,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Normal",
          "next": "Normal"
       },
       {
          "name": "Heading 2",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level2",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 13,
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "fontSizeBidi": 13,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Default Paragraph Font",
          "type": "Character",
          "characterFormat": {
             "fontColor": "empty"
          }
       },
       {
          "name": "Heading 3",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level3",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 12,
             "fontFamily": "Calibri Light",
             "fontColor": "#1F3763FF",
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
             "fontColor": "#1F3763FF",
             "fontSizeBidi": 12,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 4",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level4",
             "listFormat": {}
          },
          "characterFormat": {
             "italic": true,
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "italicBidi": true,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 5",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level5",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 6",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level6",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri Light",
             "fontColor": "#1F3763FF",
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
             "fontColor": "#1F3763FF",
             "fontFamilyBidi": "Calibri Light"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "link": "Header Char",
          "next": "Header"
       },
       {
          "name": "Header Char",
          "type": "Character",
          "characterFormat": {
             "fontSize": 11,
             "fontFamily": "Calibri",
             "fontColor": "#000000FF",
             "fontSizeBidi": 11,
             "fontFamilyBidi": "Calibri"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "link": "Footer Char",
          "next": "Footer"
       },
       {
          "name": "Footer Char",
          "type": "Character",
          "characterFormat": {
             "fontSize": 11,
             "fontFamily": "Calibri",
             "fontColor": "#000000FF",
             "fontSizeBidi": 11,
             "fontFamilyBidi": "Calibri"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "next": "List Paragraph"
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
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0003"
                }
             ]
          }
       ],
       "continuationSeparator": [
          {
             "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0004"
                }
             ]
          }
       ],
       "continuationNotice": [
          {
             "paragraphFormat": {
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
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0003"
                }
             ]
          }
       ],
       "continuationSeparator": [
          {
             "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0004"
                }
             ]
          }
       ],
       "continuationNotice": [
          {
             "paragraphFormat": {
                "listFormat": {}
             },
             "characterFormat": {},
             "inlines": []
          }
       ]
    }
 };
 describe('Margin Left', () => {
   let editor: DocumentEditor = undefined;
   beforeAll(() => {
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor)
      editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
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
   it('weblayout Left margin', () => {
     editor.open(JSON.stringify(doc2));
     let x = editor.documentHelper.viewer.clientArea.x;
     let y = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[0].x;
     expect(x).toEqual(y);
   });
   });
let doc3 : any = {
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
                   "beforeSpacing": 18,
                   "afterSpacing": 30,
                   "styleName": "Heading 1",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 18,
                   "fontFamily": "Calibri",
                   "fontSizeBidi": 18,
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 18,
                         "fontFamily": "Calibri",
                         "fontSizeBidi": 18,
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Adventure Works Cycles"
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "afterSpacing": 6,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 12,
                   "fontColor": "empty",
                   "fontSizeBidi": 12
                },
                "inlines": [
                   {
                      "characterFormat": {},
                      "shapeId": 1,
                      "name": "Text Box 5",
                      "visible": true,
                      "width": 99.36,
                      "height": 38.16,
                      "widthScale": 100,
                      "heightScale": 100,
                      "verticalPosition": 34.55,
                      "verticalOrigin": "Paragraph",
                      "verticalAlignment": "None",
                      "verticalRelativePercent": -3.4028235E38,
                      "horizontalPosition": 0,
                      "horizontalOrigin": "Margin",
                      "horizontalAlignment": "Right",
                      "horizontalRelativePercent": -3.4028235E38,
                      "zOrderPosition": 251659264,
                      "allowOverlap": true,
                      "textWrappingStyle": "Square",
                      "textWrappingType": "Both",
                      "distanceBottom": 0,
                      "distanceLeft": 9,
                      "distanceRight": 9,
                      "distanceTop": 0,
                      "layoutInCell": true,
                      "lockAnchor": false,
                      "autoShapeType": "Rectangle",
                      "fillFormat": {
                         "color": "#FFFFFFFF"
                      },
                      "lineFormat": {
                         "lineFormatType": "Solid",
                         "color": "#000000FF",
                         "weight": 1,
                         "lineStyle": "Solid",
                         "line": true
                      },
                      "textFrame": {
                         "textVerticalAlignment": "Top",
                         "leftMargin": 1.70858,
                         "rightMargin": 1.70858,
                         "topMargin": 0.85429,
                         "bottomMargin": 0.85429,
                         "blocks": [
                            {
                               "paragraphFormat": {
                                  "styleName": "Normal",
                                  "listFormat": {}
                               },
                               "characterFormat": {
                                  "fontColor": "empty"
                               },
                               "inlines": [
                                  {
                                     "characterFormat": {
                                        "fontSize": 12,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 12
                                     },
                                     "text": "Adventure Works "
                                  },
                                  {
                                     "characterFormat": {
                                        "fontSize": 12,
                                        "fontColor": "empty",
                                        "fontSizeBidi": 12
                                     },
                                     "text": "Cycles"
                                  }
                               ]
                            }
                         ]
                      }
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Adventure Works Cycles, the fictitious company on which the Adventure Works sample "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "databases are based, is a large, multinational manufacturing company. The company "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "manufactures and sells metal and composite bicycles to North American, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "European"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " and Asian commercial markets. While its base operation "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "is "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "located in"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " Bothell, Washington with 290 employees, several regional sales "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "teams are located throughout their market base."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "firstLineIndent": 36,
                   "afterSpacing": 6,
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontSize": 12,
                   "fontColor": "empty",
                   "fontSizeBidi": 12
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "In 2000, Adventure Works Cycles bought a small manufacturing plant, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Importadores"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Neptuno, located in Mexico. "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Importadores"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " Neptuno manufactures several critical "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "subcomponents for the Adventure Works Cycles product line. These subcomponents are "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "shipped to the Bothell location for final product assembly. In 2001, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "Importadores"
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": " Neptuno, "
                   },
                   {
                      "characterFormat": {
                         "fontSize": 12,
                         "fontColor": "empty",
                         "fontSizeBidi": 12
                      },
                      "text": "became the sole manufacturer and distributor of the touring bicycle product group."
                   }
                ]
             },
             {
                "paragraphFormat": {
                   "styleName": "Heading 1",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontFamily": "Calibri",
                   "fontFamilyBidi": "Calibri"
                },
                "inlines": [
                   {
                      "characterFormat": {
                         "fontFamily": "Calibri",
                         "fontFamilyBidi": "Calibri"
                      },
                      "text": "Product Overview"
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
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "afterSpacing": 0,
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 142.2,
                                        "height": 88.28252,
                                        "iscrop": false,
                                        "name": "Picture 2",
                                        "visible": true,
                                        "widthScale": 79,
                                        "heightScale": 79.000015,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Mountain-200"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-M68B-38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 25"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $2,294.99"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   },
                   {
                      "cells": [
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Mountain-300 "
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-M47B-38"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 35"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 22"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $1,079.99"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 135,
                                        "height": 83.81252,
                                        "iscrop": false,
                                        "name": "Picture 3",
                                        "visible": true,
                                        "widthScale": 75,
                                        "heightScale": 75.000015,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   },
                   {
                      "cells": [
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "textAlignment": "Center",
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {},
                                        "imageString": "data:image/gif;base64,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",
                                        "isMetaFile": false,
                                        "width": 165.6,
                                        "height": 102.81,
                                        "iscrop": false,
                                        "name": "Picture 4",
                                        "visible": true,
                                        "widthScale": 92,
                                        "heightScale": 92,
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 0
                         },
                         {
                            "blocks": [
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "beforeSpacing": 6,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontFamily": "Calibri",
                                           "fontFamilyBidi": "Calibri"
                                        },
                                        "text": "Road-150 "
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Product No: BK-R93R-44"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Size: 44"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Weight: 14"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "leftIndent": 36,
                                     "afterSpacing": 0,
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Normal",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontSize": 12,
                                     "fontColor": "empty",
                                     "fontSizeBidi": 12
                                  },
                                  "inlines": [
                                     {
                                        "characterFormat": {
                                           "fontSize": 12,
                                           "fontColor": "empty",
                                           "fontSizeBidi": 12
                                        },
                                        "text": "Price: $3,578.27"
                                     }
                                  ]
                               },
                               {
                                  "paragraphFormat": {
                                     "lineSpacing": 1,
                                     "lineSpacingType": "Multiple",
                                     "styleName": "Heading 1",
                                     "listFormat": {}
                                  },
                                  "characterFormat": {
                                     "fontFamily": "Calibri",
                                     "fontFamilyBidi": "Calibri"
                                  },
                                  "inlines": []
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
                               "shading": {
                                  "backgroundColor": "empty",
                                  "foregroundColor": "empty",
                                  "textureStyle": "TextureNone"
                               },
                               "preferredWidth": 234,
                               "preferredWidthType": "Point",
                               "cellWidth": 234,
                               "columnSpan": 1,
                               "rowSpan": 1,
                               "verticalAlignment": "Top"
                            },
                            "columnIndex": 1
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
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "left": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "right": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "bottom": {
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
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            },
                            "vertical": {
                               "hasNoneStyle": false,
                               "lineStyle": "Single",
                               "lineWidth": 0.5
                            }
                         },
                         "gridBefore": 0,
                         "gridAfter": 0
                      }
                   }
                ],
                "grid": [
                   234,
                   234
                ],
                "tableFormat": {
                   "borders": {
                      "top": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "left": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "right": {
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "bottom": {
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
                         "hasNoneStyle": false,
                         "lineStyle": "Single",
                         "lineWidth": 0.5
                      },
                      "vertical": {
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
                "columnCount": 2
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "empty"
                },
                "inlines": []
             },
             {
                "paragraphFormat": {
                   "styleName": "Normal",
                   "listFormat": {}
                },
                "characterFormat": {
                   "fontColor": "empty"
                },
                "inlines": []
             }
          ],
          "headersFooters": {
             "header": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "footer": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "evenHeader": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "evenFooter": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "firstPageHeader": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
                   }
                ]
             },
             "firstPageFooter": {
                "blocks": [
                   {
                      "paragraphFormat": {
                         "styleName": "Normal",
                         "listFormat": {}
                      },
                      "characterFormat": {
                         "fontColor": "empty"
                      },
                      "inlines": []
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
       "fontFamily": "Times New Roman",
       "underline": "None",
       "strikethrough": "None",
       "baselineAlignment": "Normal",
       "highlightColor": "NoColor",
       "fontColor": "empty",
       "boldBidi": false,
       "italicBidi": false,
       "fontSizeBidi": 11,
       "fontFamilyBidi": "Times New Roman",
       "allCaps": false
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
       "listFormat": {},
       "bidi": false
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
    "styles": [
       {
          "name": "Normal",
          "type": "Paragraph",
          "paragraphFormat": {
             "afterSpacing": 8,
             "lineSpacing": 1.15,
             "lineSpacingType": "Multiple",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri",
             "fontColor": "empty",
             "fontFamilyBidi": "Calibri"
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
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 16,
             "fontFamily": "Calibri Light",
             "fontColor": "#2E74B5FF",
             "fontSizeBidi": 16,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Normal",
          "next": "Normal"
       },
       {
          "name": "Heading 2",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level2",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 13,
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "fontSizeBidi": 13,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Default Paragraph Font",
          "type": "Character",
          "characterFormat": {
             "fontColor": "empty"
          }
       },
       {
          "name": "Heading 3",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level3",
             "listFormat": {}
          },
          "characterFormat": {
             "fontSize": 12,
             "fontFamily": "Calibri Light",
             "fontColor": "#1F3763FF",
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
             "fontColor": "#1F3763FF",
             "fontSizeBidi": 12,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 4",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level4",
             "listFormat": {}
          },
          "characterFormat": {
             "italic": true,
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "italicBidi": true,
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 5",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level5",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri Light",
             "fontColor": "#2F5496FF",
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
             "fontColor": "#2F5496FF",
             "fontFamilyBidi": "Calibri Light"
          },
          "basedOn": "Default Paragraph Font"
       },
       {
          "name": "Heading 6",
          "type": "Paragraph",
          "paragraphFormat": {
             "beforeSpacing": 2,
             "afterSpacing": 0,
             "lineSpacing": 1.0791667,
             "lineSpacingType": "Multiple",
             "outlineLevel": "Level6",
             "listFormat": {}
          },
          "characterFormat": {
             "fontFamily": "Calibri Light",
             "fontColor": "#1F3763FF",
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
             "fontColor": "#1F3763FF",
             "fontFamilyBidi": "Calibri Light"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "link": "Header Char",
          "next": "Header"
       },
       {
          "name": "Header Char",
          "type": "Character",
          "characterFormat": {
             "fontSize": 11,
             "fontFamily": "Calibri",
             "fontColor": "#000000FF",
             "fontSizeBidi": 11,
             "fontFamilyBidi": "Calibri"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "link": "Footer Char",
          "next": "Footer"
       },
       {
          "name": "Footer Char",
          "type": "Character",
          "characterFormat": {
             "fontSize": 11,
             "fontFamily": "Calibri",
             "fontColor": "#000000FF",
             "fontSizeBidi": 11,
             "fontFamilyBidi": "Calibri"
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
          "characterFormat": {
             "fontColor": "empty"
          },
          "basedOn": "Normal",
          "next": "List Paragraph"
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
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0003"
                }
             ]
          }
       ],
       "continuationSeparator": [
          {
             "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0004"
                }
             ]
          }
       ],
       "continuationNotice": [
          {
             "paragraphFormat": {
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
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0003"
                }
             ]
          }
       ],
       "continuationSeparator": [
          {
             "paragraphFormat": {
                "afterSpacing": 0,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "styleName": "Normal",
                "listFormat": {}
             },
             "characterFormat": {
                "fontColor": "empty"
             },
             "inlines": [
                {
                   "characterFormat": {
                      "fontColor": "empty"
                   },
                   "text": "\u0004"
                }
             ]
          }
       ],
       "continuationNotice": [
          {
             "paragraphFormat": {
                "listFormat": {}
             },
             "characterFormat": {},
             "inlines": []
          }
       ]
    }
 };
 describe('Margin right', () => {
   let editor: DocumentEditor = undefined;
   beforeAll(() => {
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      DocumentEditor.Inject(Selection, Editor)
      editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
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
   it('weblayout right margin', () => {
     editor.open(JSON.stringify(doc3));
     let x = editor.documentHelper.viewer.clientArea.x;
     let y = editor.documentHelper.pages[0].bodyWidgets[0].floatingElements[0].x;
     expect(x).toEqual(y);
   });
   });

let docHang: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":21.600000381469727,"bidi":false},"blocks":[{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"123 Main Street"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Santa Monica, CA 90069"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"3450 Fair Oaks Blvd."},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Suite 430"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Roseville, CA   90034"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subject: "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"\t"},{"characterFormat":{},"text":"Aventura Plaza"},{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"leftIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Request for Proposal: "},{"characterFormat":{},"text":"Paving & Surfacing"}]},{"paragraphFormat":{"leftIndent":90,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"039"}]},{"paragraphFormat":{"leftIndent":90,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":90,"styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Quotation Due Date: "},{"characterFormat":{},"text":"14.09.2012"}]},{"paragraphFormat":{"leftIndent":90,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":90,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Dear Sir/Madam:"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Your company has been selected as a possible subcontractor for the above project, and is hereby invited to "},{"characterFormat":{},"text":"submit a lump sum proposal on the subject work."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Please read all documents carefully. Your attention is directed to the enclosed Intention to Bid "},{"characterFormat":{},"text":"Confirmation Form, which must be returned to the writer within 5 days of receiving this package."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We thank you for your interest in this important project."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{PackageRespContact.DisplayName}"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{PackageRespContact.Title}"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Enclosure No. 1. Intention to Bid Form"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2. Instructions to Bidders"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"3. Bid Form"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"4. Attachments to Bid"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"5. Unit Prices"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"6. Scope of Work"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"7. Subcontract Agreement"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"8. Project Specification"}]},{"paragraphFormat":{"leftIndent":58.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"9. Contract Drawings"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 1. INTENTION TO BID FORM"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"(RETURN THIS PAGE WITHIN 5 DAYS OF RECEIPT OF BID PACKAGE TO:) "}]},{"paragraphFormat":{"textAlignment":"Center","beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"123 Main Street"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Santa Monica, CA 90069"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"ATTN: "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subject: "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"\t"},{"characterFormat":{},"text":"Aventura Plaza"},{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subcontract Inquiry: "},{"characterFormat":{},"text":"Paving & Surfacing"}]},{"paragraphFormat":{"leftIndent":85.5,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"039"}]},{"paragraphFormat":{"leftIndent":85.5,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Dear Sir/Madam:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We hereby acknowledge receipt of the complete set of bidding documents for the above referenced "},{"characterFormat":{},"text":"project work, and confirm that:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"(Check appropriate box)"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{"listId":9,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We do intend to submit a proposal for this work. We understand that this proposal will be "},{"characterFormat":{},"text":"prepared by us at no cost or obligation to "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":" or "},{"characterFormat":{},"text":"Northern Hospitals, Inc."},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{"listId":9,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We do not intend to bid on this work, and are hereby returning the bidding documents received. "},{"characterFormat":{},"text":"The reason(s) we decline to offer a proposal are as follows:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Yours sincerely,"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Hugh"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"{Contacts.MiddleName}"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Jones"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":194.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":7.3,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":3.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251659264,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":194.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":7.3,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":219.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251660288,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Name"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"Signature"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Northern Hospitals, Inc."},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"{Contacts.Title}"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":194.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":4.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":3.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251661312,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":194.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":4.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":219.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251662336,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Firm"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"Title"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":194.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":8.9,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":219.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251663360,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"Date"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{},"tabs":[{"position":220.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 2  INSTRUCTIONS TO BIDDERS"}]},{"paragraphFormat":{"leftIndent":67.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"On "},{"characterFormat":{},"text":"Paving & Surfacing"},{"characterFormat":{},"text":" for "}]},{"paragraphFormat":{"leftIndent":67.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"leftIndent":67.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"leftIndent":67.5,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{"listId":2,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Sealed bids for the work described within this document will be received at the following address "},{"characterFormat":{"underline":"Single"},"text":"on or before "},{"characterFormat":{"underline":"Single"},"text":"14.09.2012"},{"characterFormat":{"underline":"Single"},"text":", "},{"characterFormat":{"underline":"Single"},"text":"1:00"},{"characterFormat":{},"text":", and will be privately opened."}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"123 Main Street"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Santa Monica, CA 90069"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The bids, based on the Subcontract Bidding Documents, shall be held as responsible lump sum bids "},{"characterFormat":{},"text":"made with full knowledge of conditions and requirements of the work to be performed. Bidders are "},{"characterFormat":{},"text":"directed to visit above site prior to the time of submitting the bid and thoroughly inspect the "},{"characterFormat":{},"text":"conditions under which the Contract is to be executed. No consideration will be given to requests for "},{"characterFormat":{},"text":"additions to the contract lump sum amount for work resulting from existing conditions or restrictions "},{"characterFormat":{},"text":"on the use of the premises which could have been determined during the bid period, whether or not "},{"characterFormat":{},"text":"that work is indicated or described on the contract drawings and specifications."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bids are to be made on the forms provided and enclosed in an envelope, sealed and endorsed with the "},{"characterFormat":{},"text":"name of the work as follows: Confidential Bid for "},{"characterFormat":{},"text":"Paving & Surfacing"},{"characterFormat":{},"text":", reference "},{"characterFormat":{},"text":"039"},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bids shall be open for acceptance for "},{"characterFormat":{},"text":"60"},{"characterFormat":{},"text":" after bid due date."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bids not submitted on the forms provided and in accordance with the instructions contained herein "},{"characterFormat":{},"text":"shall be considered informal, and at the option of "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":", may be rejected."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The Subcontract Bidding Document Package includes:"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Intention to Bid Confirmation Form"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Instructions to Bidders"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bid Form"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Attachments to Bid"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Unit Prices Form"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Scope of Work"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Sample Subcontractor Agreement"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Project Specifications"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Contract Drawings"}]},{"paragraphFormat":{"leftIndent":85.69999694824219,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bids must be submitted on the prescribed Bid Form in duplicate. All blank spaces for prices must be "},{"characterFormat":{},"text":"filled in, in ink or typewritten, and total amounts indicated in both words and figures. Lump Sum Bid "},{"characterFormat":{},"text":"is to be firm through completion of field construction with no claims for material or labor cost "},{"characterFormat":{},"text":"escalation."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bidder shall submit his bid in accordance with this inquiry and attachments. Alternate proposals may "},{"characterFormat":{},"text":"be submitted provided they are labeled “ALTERNATE” and all deviations from the specification are "},{"characterFormat":{},"text":"individually indicated and described."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bidder must be licensed to perform business as a contractor in the State where job site is located if "},{"characterFormat":{},"text":"State and/or local municipal laws require such licensing."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"All work and/or services, including delivery to job site, to be provided by the subcontractor shall be "},{"characterFormat":{},"text":"performed by utilizing respective Trade Union labor. The subcontractor is directed that the performance "},{"characterFormat":{},"text":"of all work under this subcontract shall be in accordance with current local trade line jurisdiction "},{"characterFormat":{},"text":"practice."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Any additional or supplemental instructions will be in the form of written Addenda to the scope of "},{"characterFormat":{},"text":"work. All addenda so issued shall become part of the contract documents and shall be acknowledged "},{"characterFormat":{},"text":"in the bidder’s proposal in the space provided therefore."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The attention of each bidder is directed to the requirements for submission of a proposed duration to "},{"characterFormat":{},"text":"perform the work within a consecutive calendar day period allowing for the reasonable coordination "},{"characterFormat":{},"text":"and scheduling of work by other subcontractors consistent with the standard construction industry "},{"characterFormat":{},"text":"practice. Each bidder shall complete and submit a projected manpower loading schedule, indicating "},{"characterFormat":{},"text":"respective trades assigned to perform the work. Manpower loading schedules are not required to be "},{"characterFormat":{},"text":"submitted with the bidders proposal, but will be required prior to bid review, if so directed by "},{"characterFormat":{},"text":"Acme "},{"characterFormat":{},"text":"Construction, Inc."},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bidders shall include in their bids any and all amounts required for all applicable taxes, including "},{"characterFormat":{},"text":"sales or use taxes as applicable to complete their work."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bidders shall include in their bids any and all costs necessary to obtain required permits to perform "},{"characterFormat":{},"text":"their work."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":" reserves the right to accept or reject any or all bids and further reserves the "},{"characterFormat":{},"text":"right to award the work to the bidder who "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":" deems is best suited to perform "},{"characterFormat":{},"text":"the work."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The basis for award, subject to the conditions stipulated above, shall be the firm lump sum base bid "},{"characterFormat":{},"text":"amount for all of the work required and described by the contract documents package."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Each subcontract bidder is required to identify by name any subcontractors that he proposes to use for "},{"characterFormat":{},"text":"the work should he be awarded the contract. In addition to the above requirement, each subcontract "},{"characterFormat":{},"text":"bidder shall identify the lump sum dollar amount to be allocated to each of the respective named "},{"characterFormat":{},"text":"subcontractors. The above information shall be shown in the space(s) provided on the Attachments to "},{"characterFormat":{},"text":"Bid Form. Each bidder shall provide adequate background information and details in the form of "},{"characterFormat":{},"text":"references, past work performed, etc., to establish the specialty subcontractor’s acceptability to the "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":", if so requested."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":21,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bidders who require access to project site and premises during bid period should contact:"}]},{"paragraphFormat":{"leftIndent":72,"firstLineIndent":0,"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"123 Main Street"}]},{"paragraphFormat":{"leftIndent":36,"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Santa Monica, CA 90069"}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":15,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Unit prices must be submitted with the bid. Bidders are directed to complete the bid form sections "},{"characterFormat":{},"text":"listing markup percentages to be applied to changes in the Work."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":15,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"All lump sum bids shall be based on the material or equipment specified within this bidding "},{"characterFormat":{},"text":"document package. Any proposed deviation from the requirements of the contract shall be listed "},{"characterFormat":{},"text":"separately on the Bid Form, and any change in the lump sum amount identified. Within seven days "},{"characterFormat":{},"text":"from the bid due date, each bidder shall prepare a list of specific equipment or material manufacturers "},{"characterFormat":{},"text":"proposed for use on the project, if so requested by "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":15,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"For questions regarding information contained in this inquiry, please contact the following:"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{PackageRespContact.DisplayName}"},{"characterFormat":{},"text":", "},{"characterFormat":{},"text":"{PackageRespContact.Title}"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{PackageRespContact.DisplayAddress}"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Tel: "},{"characterFormat":{},"text":"{PackageRespContact.Tel}"},{"characterFormat":{},"text":" Fax: "},{"characterFormat":{},"text":"{PackageRespContact.Fax}"},{"characterFormat":{},"text":" e-mail: "},{"characterFormat":{},"text":"{PackageRespContact.EMail}"}]},{"paragraphFormat":{"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{"listId":15,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bid, payment, and performance bonds, if requested, shall be furnished by the subcontractor and "},{"characterFormat":{},"text":"issued by a surety company acceptable to "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":" the cost of such bonds, if required, "},{"characterFormat":{},"text":"shall be reimbursed separately from the proposed lump sum amount."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"BID DUE DATE: "},{"characterFormat":{},"text":"14.09.2012"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"PRE-BID MEETING: "},{"characterFormat":{},"text":"31.08.2012"},{"characterFormat":{},"text":", "},{"characterFormat":{},"text":"3:30"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"LakeWood Main Office"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"TENTATIVE CONTRACT VERBAL AWARD DATE: "},{"characterFormat":{},"text":"28.09.2012"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"START IN FIELD DATE: "},{"characterFormat":{},"text":"05.10.2012"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"COMPLETE CONSTRUCTION DATE: "},{"characterFormat":{},"text":"27.05.2012"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 3  BID FORM"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Acme Construction, Inc."}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"123 Main Street"}]},{"paragraphFormat":{"textAlignment":"Center","styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Santa Monica, CA 90069"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"List","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"ATTN: "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"{PackageRespContact.DisplayName}"}]},{"paragraphFormat":{"firstLineIndent":36,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{PackageRespContact.Title}"}]},{"paragraphFormat":{"leftIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"List","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subject: "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"\t"},{"characterFormat":{},"text":"Aventura Plaza"},{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"firstLineIndent":36,"beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Paving & Surfacing"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"039"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":302.40002,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":8.4,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":118.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251664384,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"We the undersigned company "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"having carefully reviewed the Subcontract Bidding Document Package for the above subject Project, and "},{"characterFormat":{},"text":"being satisfied that we fully understand them, upon written notice of award of contract agree to provide "},{"characterFormat":{},"text":"all supervision, labor, material, construction equipment, plant, facilities, services, safety and insurance, "},{"characterFormat":{},"text":"our bid also includes all taxes, permit costs, fees, and other costs necessary or required in the Contract "},{"characterFormat":{},"text":"documents, to accomplish in a safe and timely and workmanlike manner the Work described in the "},{"characterFormat":{},"text":"Subcontract Bidding Document Package for he following firm lump sum base bid:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":446.4,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":5.7,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":-3.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251665408,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"italic":true,"italicBidi":true},"text":"$ "},{"characterFormat":{},"text":"(written amount)"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"the complete scope of work covered by the above firm lump sum is included in the attached breakdown in "},{"characterFormat":{},"text":"the “Attachments to Bid” form for the purpose of bid evaluation by "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":" "}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Company: "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":410.40002000000004,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":0.15,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":46.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251666432,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"By: "}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":439.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":1.65,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":18,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251667456,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"(Signature)"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Mr."},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Hugh"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"{Contacts.MiddleName}"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Jones"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":432,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":10.35,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251668480,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Title: "},{"characterFormat":{},"text":"{Contacts.Title}"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Date: "}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":432,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":0.35,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251669504,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Witnessed by:"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":396,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":1.85,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":61.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251670528,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"(Signature)"}]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Mr."},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Hugh"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"{Contacts.MiddleName}"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Jones"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":432,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":10.55,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251671552,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Title: "},{"characterFormat":{},"text":"{Contacts.Title}"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Name:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":424.80002,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":0.55,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":32.4,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251672576,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":432,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":13.55,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251673600,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Date:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 4  ATTACHMENTS TO BID"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subject: "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"\t"},{"characterFormat":{},"text":"Aventura Plaza"},{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"SUBCONTRACT INQUIRY: "},{"characterFormat":{},"text":"Paving & Surfacing"}]},{"paragraphFormat":{"leftIndent":108,"firstLineIndent":36,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"039"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Bid Due Date: "},{"characterFormat":{},"text":"14.09.2012"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We hereby submit the following information as directed by the Subcontract Bidding Document Package "},{"characterFormat":{},"text":"for the subject work, which is included in and a part of our bid to perform the work:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Item Short "},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Description"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":87,"preferredWidthType":"Point","cellWidth":153,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Quantit"},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"y"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":54,"preferredWidthType":"Point","cellWidth":67.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Uni"},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"t"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":31.5,"preferredWidthType":"Point","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Spec "},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Section"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":67.5,"preferredWidthType":"Point","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"SpecSubS"},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"ection"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":67.5,"preferredWidthType":"Point","cellWidth":67.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":5},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Category"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":72,"preferredWidthType":"Point","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":6},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Total Cost"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":72,"preferredWidthType":"Point","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":7}],"rowFormat":{"height":26.25,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":1,"gridBeforeWidth":3,"gridBeforeWidthType":"Point","gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":8.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":240,"columnSpan":4,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":67.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":5},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":6},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":72,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":7},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":8},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"U"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"t"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"i"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"l"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"i"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"t"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"y "},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"S"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"e"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"r"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"v"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"i"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"c"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"e"},{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"s"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":9},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":10}],"rowFormat":{"height":15,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":1,"gridBeforeWidth":3,"gridBeforeWidthType":"Point","gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":8.4}}],"grid":[3,87,54,31.5,67.5,67.5,72,72,11.8,11.8,11.8],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":8.399999618530273,"tableAlignment":"Left","topMargin":0,"rightMargin":5.400000095367432,"leftMargin":5.400000095367432,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":11},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":165.6,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":11.05,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":212.4,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251674624,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Total Firm Lump Sum Price"},{"characterFormat":{},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"$"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"       "},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"italic":true,"italicBidi":true},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":108,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":24.05,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":270,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251675648,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"The cost to provide the insurance coverage in the amounts required by the Subcontract Bidding Document "},{"characterFormat":{},"text":"Package , which is included in the above firm lump sum price, is "},{"characterFormat":{"italic":true,"italicBidi":true},"text":"$"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"       "},{"characterFormat":{},"text":" ."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The cost to provide the permits required by the Subcontract Bidding Document Package , which is "},{"characterFormat":{},"text":"included in the above firm lump sum price, is "},{"characterFormat":{"italic":true,"italicBidi":true},"text":"$"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"       "},{"characterFormat":{},"text":" ."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":115.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":2.55,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":154.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251676672,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The cost to provide the local and state taxes required by the Subcontract Bidding Document Package, "},{"characterFormat":{},"text":"which is included in the above firm lump sum price, is "},{"characterFormat":{"italic":true,"italicBidi":true},"text":"$"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"\t"},{"characterFormat":{"italic":true,"italicBidi":true},"text":"       "},{"characterFormat":{},"text":" ."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":115.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":4.05,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":226.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251677696,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":93.60001,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":21.35,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":298.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251678720,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Bid, payment, and performance bonds for this project, if required by "},{"characterFormat":{},"text":"Acme Construction, Inc."},{"characterFormat":{},"text":", are not "},{"characterFormat":{},"text":"included in the above lump sum price. The cost of bonds, if required, is "},{"characterFormat":{"italic":true,"italicBidi":true},"text":"$"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"We propose that for changes in scope to this contract, amounts billed for additional work performed will "},{"characterFormat":{},"text":"be marked up as follows:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Labor Rate"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{"backgroundColor":"#FFFFFFFF","foregroundColor":"#000000FF","textureStyle":"Texture20Percent"},"preferredWidthType":"Auto","cellWidth":432,"columnSpan":5,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0}],"rowFormat":{"height":21,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":130.5,"preferredWidthType":"Point","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Bare Cost"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":75.3499984741211,"preferredWidthType":"Point","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Overhead "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":75.4000015258789,"preferredWidthType":"Point","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Profit"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":75.3499984741211,"preferredWidthType":"Point","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Total"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":75.4000015258789,"preferredWidthType":"Point","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":21.100000381469727,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"Materials"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"N/A"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":22,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"Labor"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":22,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"Subcontractor "}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":22,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"Third Party Costs"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":22,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"Equipment Rental"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":"N/A"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.3499984741211,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"leftIndent":0,"textAlignment":"Center","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":75.4000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4}],"rowFormat":{"height":22,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":5.4}}],"grid":[130.5,75.3499984741211,75.4000015258789,75.3499984741211,75.4000015258789],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":5.400000095367432,"tableAlignment":"Left","topMargin":0,"rightMargin":5.400000095367432,"leftMargin":5.400000095367432,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":5},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"To perform the work of this subcontract, making allowance for the normal coordination and progress of "},{"characterFormat":{},"text":"the work of other subcontracts, equipment delivery, etc., we anticipate the following number of "},{"characterFormat":{},"text":"consecutive "},{"characterFormat":{},"shapeId":0,"visible":true,"width":72,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":36,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":291.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251679744,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"working days will be required to complete the work of this subcontract: "},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"  days."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"To perform the subject work, we propose to issue the following sub-subcontracts, and use the named "},{"characterFormat":{},"text":"specialty sub-subcontractors to perform portions of the work we do not self-perform:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{},"tabs":[{"position":202.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":79.19998000000001,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":49.1,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":313.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251686912,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.19998000000001,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":27.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":313.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251687936,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":49.1,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":205.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251685888,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":27.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":205.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251684864,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":49.1,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":97.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251683840,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":27.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":97.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251682816,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":49.1,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":-3.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251681792,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"shapeId":0,"visible":true,"width":79.2,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":27.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":-3.6,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251680768,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Work element"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"           Sub-subcontractor"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"          Name and Address"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"         Value of Work"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"textAlignment":"Justify","beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"This "},{"characterFormat":{},"text":"lump "},{"characterFormat":{},"text":"sum "},{"characterFormat":{},"text":"bid, "},{"characterFormat":{},"text":"including "},{"characterFormat":{},"text":"unit "},{"characterFormat":{},"text":"prices, "},{"characterFormat":{},"text":"markups, "},{"characterFormat":{},"text":"alternates, "},{"characterFormat":{},"text":"etc., "},{"characterFormat":{},"text":"will "},{"characterFormat":{},"text":"remain "},{"characterFormat":{},"text":"in "},{"characterFormat":{},"text":"effect "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"{BidPackages.BidValidForDays}"},{"characterFormat":{},"text":" days "},{"characterFormat":{},"text":"from "},{"characterFormat":{},"text":"the "},{"characterFormat":{},"text":"due "},{"characterFormat":{},"text":"date "},{"characterFormat":{},"text":"of "},{"characterFormat":{},"text":"bid. "},{"characterFormat":{},"text":"Addenda "},{"characterFormat":{},"text":"to "},{"characterFormat":{},"text":"the "},{"characterFormat":{},"text":"construction "},{"characterFormat":{},"text":"documents "},{"characterFormat":{},"text":"are "},{"characterFormat":{},"text":"included "},{"characterFormat":{},"text":"in "},{"characterFormat":{},"text":"the "},{"characterFormat":{},"text":"above "},{"characterFormat":{},"text":"price "},{"characterFormat":{},"text":"and "},{"characterFormat":{},"text":"receipt "},{"characterFormat":{},"text":"thereof "},{"characterFormat":{},"text":"is "},{"characterFormat":{},"text":"acknowledged "},{"characterFormat":{},"text":"as "},{"characterFormat":{},"text":"follows:"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"No."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":59.400001525878906,"preferredWidthType":"Point","cellWidth":59.400001525878906,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Description"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":108,"preferredWidthType":"Point","cellWidth":108,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{"bold":true,"boldBidi":true},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Dated"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":103.5,"preferredWidthType":"Point","cellWidth":103.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{BidAdde"},{"characterFormat":{},"text":"nda.Numb"},{"characterFormat":{},"text":"er}"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":59.400001525878906,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{BidAddenda.Descri"},{"characterFormat":{},"text":"ption}"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":108,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{BidAddenda.Date}"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":103.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4}}],"grid":[59.400001525878906,108,103.5],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.400000095367432,"leftMargin":5.400000095367432,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":3},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"afterSpacing":6,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Provide a separate sheet itemizing any and all of the following items applicable to your bid or "},{"characterFormat":{},"text":"performance of the work."}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"List","listFormat":{"listId":7,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Exceptions to Bid"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"List","listFormat":{"listId":7,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Alternates and Effect on Bid "}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"List","listFormat":{"listId":7,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Qualification Statements"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Company:"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Northern Hospitals, Inc."},{"characterFormat":{},"shapeId":0,"visible":true,"width":309.6,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":-0.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":46.8,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251688960,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":309.6,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":13.8,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":18,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251689984,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"By:"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"(Signature)"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Mr."},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Hugh"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"{Contacts.MiddleName}"},{"characterFormat":{},"text":" "},{"characterFormat":{},"text":"Jones"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":309.59998,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":13.5,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251691008,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Title: "}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\t"},{"characterFormat":{},"text":"{Contacts.Title}"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"shapeId":0,"visible":true,"width":309.59998,"height":0,"widthScale":100,"heightScale":100,"verticalPosition":13.3,"verticalOrigin":"Paragraph","verticalAlignment":"None","verticalRelativePercent":-3.4028235e+38,"horizontalPosition":25.2,"horizontalOrigin":"Column","horizontalAlignment":"None","horizontalRelativePercent":-3.4028235e+38,"zOrderPosition":251692032,"allowOverlap":true,"textWrappingStyle":"TopAndBottom","textWrappingType":"Both","distanceBottom":0,"distanceLeft":0,"distanceRight":0,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"StraightConnector","fillFormat":{"color":"#FFFFFFFF","fill":true},"lineFormat":{"color":"#00000000","weight":0.75,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Top","leftMargin":5.31525,"rightMargin":5.31525,"topMargin":2.76375,"bottomMargin":2.76375,"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}},{"characterFormat":{},"text":"Date:"},{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 5  UNIT PRICES"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subject: "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"\t"},{"characterFormat":{},"text":"Aventura Plaza"},{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":" "},{"characterFormat":{},"text":"for "},{"characterFormat":{},"text":"Northern Hospitals, Inc."}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"2100 Pine Street"},{"characterFormat":{},"text":"\u000b"},{"characterFormat":{},"text":"Santa Monica, CA 90025"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Job No.: "},{"characterFormat":{},"text":"99-4192"}]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"beforeSpacing":0,"styleName":"Endnote Text","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"SUBCONTRACT INQUIRY: "},{"characterFormat":{},"text":"Paving & Surfacing"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"039"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{BidSpecialPricing.Description}"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Unit prices for additional or deleted work listed below shall include all necessary supervision, labor, "},{"characterFormat":{},"text":"material, plant equipment and taxes. The following unit prices shall apply for all additions or deletions to "},{"characterFormat":{},"text":"the subcontract package."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Items"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":48.75,"preferredWidthType":"Point","cellWidth":49.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Unit"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":49.5,"preferredWidthType":"Point","cellWidth":99,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Labor"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":45,"preferredWidthType":"Point","cellWidth":85.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":3},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Material"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":54,"preferredWidthType":"Point","cellWidth":90.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Total"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":40.5,"preferredWidthType":"Point","cellWidth":93.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":5},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Notes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":45,"preferredWidthType":"Point","cellWidth":45,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":6},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Labo"},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"r"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":41.25,"preferredWidthType":"Point","cellWidth":41.25,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":7},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Materia"},{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"l"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":49.5,"preferredWidthType":"Point","cellWidth":49.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":8},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Total"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":39.75,"preferredWidthType":"Point","cellWidth":39.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":9},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"bold":true,"fontFamily":"Arial","boldBidi":true,"fontFamilyBidi":"Arial"},"text":"Notes"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":54,"preferredWidthType":"Point","cellWidth":54,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":10}],"rowFormat":{"height":24.75,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":1,"gridBeforeWidth":0.75,"gridBeforeWidthType":"Point","gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":6.15}},{"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":48.75,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":94.5,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":139.5,"columnSpan":3,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":4},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":41.25,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":7},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":89.25,"columnSpan":2,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":8},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":54,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":10},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":11},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":12},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":13},{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"inlines":[{"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":11.8,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Center"},"columnIndex":14}],"rowFormat":{"height":18,"allowBreakAcrossPages":false,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":1,"gridBeforeWidth":0.75,"gridBeforeWidthType":"Point","gridAfter":0,"leftMargin":5.4,"rightMargin":5.4,"leftIndent":6.15}}],"grid":[0.75,48.75,49.5,45,54,40.5,45,41.25,49.5,39.75,54,11.8,11.8,11.8,11.8],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":6.150000095367432,"tableAlignment":"Left","topMargin":0,"rightMargin":5.400000095367432,"leftMargin":5.400000095367432,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":15},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","outlineLevel":"Level1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 6  SCOPE OF WORK"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"{BidPackages.ScopeOfWork}"},{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 7 SUBCONTRACT AGREEMENT"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Every contractor has his or her own views and thoughts, which are usually based on experience, on what "},{"characterFormat":{},"text":"should be contained within a subcontract agreement. The subcontract agreement defines the rights and "},{"characterFormat":{},"text":"obligations of both the contractor and subcontractor. The subcontract agreement is basically an operating "},{"characterFormat":{},"text":"procedure on how the contract is to be administered and coordinated. There are certain preprinted "},{"characterFormat":{},"text":"subcontract agreements available to contractors and subcontractors. The American Institute of Architects "},{"characterFormat":{},"text":"Form A401 Contractor-Subcontractor Agreement Form (5/87) is one example and is widely used "},{"characterFormat":{},"text":"throughout the construction industry."}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"afterSpacing":6,"styleName":"Normal Indent","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"The following is a list of items that should be considered and possibly be expanded and included in a "},{"characterFormat":{},"text":"subcontract agreement:"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Definitions"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Administration of the agreement"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Obligations of subcontractors"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Compensation and terms of payment"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Extra work or variations"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Completion of the work"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Termination default and suspension"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Delays, extension of time"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Claims"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Arbitration"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Performance and labor/material payment bond"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Subcontractors insurance requirements"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Lien indemnification"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Sub-subcontractors"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Force majeure"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Title"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Assignments"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Warranty"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Reports"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Equal Employment Opportunity and Fair Employment Practices"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Safety"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Field office"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Storage and warehousing"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Coordination with other subcontractors"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Cleanup requirements"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Testing"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Product data"}]},{"paragraphFormat":{"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{"listId":1,"listLevelNumber":0}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Permits "},{"characterFormat":{},"text":"\f"},{"characterFormat":{},"text":"Enclosure No. 8  CONTRACT DRAWINGS AND SPECIFICATIONS"}]},{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Drawing/ "},{"characterFormat":{"bold":true,"boldBidi":true},"text":"Specification No."}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":108.9000015258789,"preferredWidthType":"Point","cellWidth":108.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Description"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":130.5,"preferredWidthType":"Point","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Revision"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":119.69999694824219,"preferredWidthType":"Point","cellWidth":119.69999694824219,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"boldBidi":true},"text":"Date"}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidth":119.69999694824219,"preferredWidthType":"Point","cellWidth":119.69999694824219,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":108.9000015258789,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":130.5,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":119.69999694824219,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"beforeSpacing":0,"lineSpacing":1.5,"lineSpacingType":"Multiple","styleName":"Normal Indent","listFormat":{},"tabs":[{"position":184.5,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"},{"position":333,"deletePosition":0,"tabJustification":"Left","tabLeader":"None"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"text":""}]}],"cellFormat":{"borders":{"top":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"left":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"right":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"bottom":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"vertical":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0}},"shading":{},"preferredWidthType":"Auto","cellWidth":119.69999694824219,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":1,"allowBreakAcrossPages":true,"heightType":"AtLeast","isHeader":false,"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"gridBefore":0,"gridAfter":0,"leftMargin":5.4,"rightMargin":5.4}}],"grid":[108.9000015258789,130.5,119.69999694824219,119.69999694824219],"tableFormat":{"borders":{"top":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"left":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"right":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"bottom":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"diagonalUp":{"hasNoneStyle":false,"lineStyle":"None","lineWidth":0},"horizontal":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5},"vertical":{"color":"#000000FF","hasNoneStyle":false,"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"tableAlignment":"Left","topMargin":0,"rightMargin":5.400000095367432,"leftMargin":5.400000095367432,"bottomMargin":0,"preferredWidthType":"Auto","bidi":false,"allowAutoFit":false},"description":null,"title":null,"columnCount":4},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"leftIndent":-13.5,"firstLineIndent":13.5,"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bold":true,"fontSize":9,"fontFamily":"Arial","boldBidi":true,"fontSizeBidi":9,"fontFamilyBidi":"Arial"},"text":"Prolog"},{"characterFormat":{},"text":" "},{"characterFormat":{"bold":true,"italic":true,"boldBidi":true,"italicBidi":true},"text":"Manager"},{"characterFormat":{"bold":true,"italic":true,"fontSize":8,"boldBidi":true,"italicBidi":true,"fontSizeBidi":8},"text":"                                               "},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":" FILENAME \\* Upper\\p \\* MERGEFORMAT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontSize":8,"fontFamily":"Arial","fontSizeBidi":8,"fontFamilyBidi":"Arial"},"text":"DOCUMENT IN PROLOG MANAGER"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"bold":true,"italic":true,"fontSize":8,"boldBidi":true,"italicBidi":true,"fontSizeBidi":8},"text":"                                                           "},{"characterFormat":{"italic":true,"fontSize":8,"italicBidi":true,"fontSizeBidi":8},"text":" Page "},{"characterFormat":{"italic":true,"fontSize":8,"styleName":"Page Number","italicBidi":true,"fontSizeBidi":8},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"italic":true,"fontSize":8,"styleName":"Page Number","italicBidi":true,"fontSizeBidi":8},"text":" PAGE "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"italic":true,"fontSize":8,"styleName":"Page Number","italicBidi":true,"fontSizeBidi":8},"text":"15"},{"characterFormat":{},"fieldType":1}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Times New Roman","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Times New Roman","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":true,"formFieldShading":true,"compatibilityMode":"Word2007","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"beforeSpacing":6,"outlineLevel":"Level5","listFormat":{"listId":8,"listLevelNumber":0},"keepWithNext":true,"widowControl":false},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Heading 7","type":"Paragraph","paragraphFormat":{"beforeSpacing":3,"afterSpacing":3,"outlineLevel":"Level7","listFormat":{"listId":18,"listLevelNumber":0},"widowControl":false},"characterFormat":{"bold":true,"boldBidi":true},"basedOn":"Normal","next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"Header"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"listFormat":{},"tabs":[{"position":216,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":432,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","next":"Footer"},{"name":"Page Number","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Notes1","type":"Paragraph","paragraphFormat":{"rightIndent":108,"afterSpacing":12,"listFormat":{"listId":6,"listLevelNumber":0}},"characterFormat":{"fontFamily":"Arial","fontFamilyBidi":"Arial"},"basedOn":"Normal","next":"Notes1"},{"name":"List Bullet 5","type":"Paragraph","paragraphFormat":{"leftIndent":74.5999984741211,"beforeSpacing":3,"listFormat":{"listId":0,"listLevelNumber":0},"tabs":[{"position":74.5999984741211,"deletePosition":0,"tabJustification":"List","tabLeader":"None"},{"position":0,"deletePosition":90,"tabJustification":"Left","tabLeader":"None"}],"widowControl":false},"characterFormat":{},"basedOn":"Normal","next":"List Bullet 5"},{"name":"Normal Indent","type":"Paragraph","paragraphFormat":{"leftIndent":36,"beforeSpacing":3,"listFormat":{},"widowControl":false},"characterFormat":{},"basedOn":"Normal","next":"Normal Indent"},{"name":"Endnote Text","type":"Paragraph","paragraphFormat":{"beforeSpacing":3,"listFormat":{},"widowControl":false},"characterFormat":{},"basedOn":"Normal","next":"Endnote Text"},{"name":"List","type":"Paragraph","paragraphFormat":{"leftIndent":18,"firstLineIndent":-18,"beforeSpacing":3,"listFormat":{},"widowControl":false},"characterFormat":{},"basedOn":"Normal","next":"List"},{"name":"Document Map","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontFamily":"Tahoma","fontFamilyBidi":"Tahoma"},"basedOn":"Normal","next":"Document Map"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0},{"abstractListId":1,"levelOverrides":[],"listId":1},{"abstractListId":2,"levelOverrides":[],"listId":2},{"abstractListId":6,"levelOverrides":[],"listId":6},{"abstractListId":7,"levelOverrides":[],"listId":7},{"abstractListId":8,"levelOverrides":[],"listId":8},{"abstractListId":9,"levelOverrides":[],"listId":9},{"abstractListId":15,"levelOverrides":[],"listId":15},{"abstractListId":18,"levelOverrides":[],"listId":18},{"abstractListId":21,"levelOverrides":[],"listId":21}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":90,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":1,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#000000FF","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":2,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#000000FF","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":6,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":7,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#000000FF","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":8,"levels":[{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":9,"levels":[{"characterFormat":{"bold":false,"italic":false,"fontSize":12,"fontFamily":"Wingdings","boldBidi":false,"italicBidi":false,"fontSizeBidi":12,"fontFamilyBidi":"Wingdings"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":15,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#000000FF","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":18,"levels":[{"characterFormat":{"fontFamily":"Wingdings","fontFamilyBidi":"Wingdings"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]},{"abstractListId":21,"levels":[{"characterFormat":{"fontFamily":"Symbol","fontColor":"#000000FF","fontFamilyBidi":"Symbol"},"paragraphFormat":{"firstLineIndent":-18,"listFormat":{},"tabs":[{"position":18,"deletePosition":0,"tabJustification":"List","tabLeader":"None"}]},"followCharacter":"Tab","listLevelPattern":"Bullet","numberFormat":"","restartLevel":0,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":1,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":2,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":3,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":4,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":5,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":6,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":7,"startAt":0},{"characterFormat":{},"paragraphFormat":{"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"","restartLevel":8,"startAt":0}]}],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Document hanging check with floating element', () => {
   let editor: DocumentEditor = undefined;
   beforeAll(() => {
      let ele: HTMLElement = createElement('div', { id: 'container' });
      document.body.appendChild(ele);
      editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
      DocumentEditor.Inject(Editor, Selection); editor.enableEditorHistory = true;
      //   editor = new DocumentEditor({ isReadOnly: false, enableEditor: true, layoutType: 'Continuous' });
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
   it('Document hanging check with floating element', () => {      
      expect(() => { editor.open(JSON.stringify(docHang)); }).not.toThrowError();
   });
});
