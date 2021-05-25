import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer, DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { TextElementBox, BodyWidget, ParagraphWidget, LineWidget, EditRangeStartElementBox, EditRangeEndElementBox, FieldElementBox, TextFormField, CheckBoxFormField, DropDownFormField, BlockWidget, ElementBox, ContentControl, TableCellWidget, TableRowWidget } from '../../../src/document-editor/implementation/viewer/page';
import { ContentControlWidgetType, ContentControlType } from '../../../src';


let charParaBidi: any = { "sections": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "???", "characterFormat": { "bidi": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second column", "characterFormat": { "bdo": "RTL" } }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": " ", "characterFormat": { "bdo": "RTL" } }, { "text": "?", "characterFormat": { "bdo": "RTL" } }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Third column " }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "Second Page" }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "ssASasAS" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": true } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Character", "name": "Line Number", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Header", "basedOn": "Normal", "link": "Header Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Header Char", "basedOn": "Default Paragraph Font" }, { "type": "Paragraph", "name": "Footer", "basedOn": "Normal", "link": "Footer Char", "paragraphFormat": { "afterSpacing": 0.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple", "tabs": [{ "tabJustification": "Center", "position": 234.0, "tabLeader": "None", "deletePosition": 0.0 }, { "tabJustification": "Right", "position": 468.0, "tabLeader": "None", "deletePosition": 0.0 }] } }, { "type": "Character", "name": "Footer Char", "basedOn": "Default Paragraph Font" }] };
let tableBidi: any = { "sections": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "sample" }] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "cells": [{ "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "blocks": [{ "characterFormat": { "bidi": true }, "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }], "cellFormat": { "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } }, "bidi": true } }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "hgfgfghfgfghfhgfgh" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };

let pageBreak: any = { "sections": [{ "sectionFormat": { "pageWidth": 595.2999877929688, "pageHeight": 841.9000244140625, "leftMargin": 36, "rightMargin": 36, "topMargin": 28.350000381469727, "bottomMargin": 28.350000381469727, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 21.25, "footerDistance": 36, "bidi": false }, "blocks": [{ "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "textAlignment": "Center", "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "text": "\f" }, { "characterFormat": {}, "text": "Job title:" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 542.5999755859375, "preferredWidthType": "Point", "cellWidth": 542.5999755859375, "columnSpan": 2, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 14.300000190734863, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "General Transactions" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "Sys" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "tem & Warehouse  administration" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "Inventory Management" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "Customs" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 261.8999938964844, "preferredWidthType": "Point", "cellWidth": 261.8999938964844, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " Inbound" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " Outbound" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "Quality Management" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 280.6499938964844, "preferredWidthType": "Point", "cellWidth": 280.6999816894531, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 98.75, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [{ "characterFormat": { "fontFamily": "Verdana" }, "text": "Comment" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " (" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "Extra role" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "s, Extra transactions from document" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }, { "characterFormat": {}, "fieldType": 0 }, { "characterFormat": {}, "text": "HYPERLINK \"file:///Users/pavel/Downloads/roles&transactions/Role%20pro%20AC%20a%20FG%20dle%20pracovního%20zařazení.xlsx\" " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": "G:\\HR\\Forms\\roles&transactions" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": { "fontFamily": "Verdana" }, "text": ")" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": ":" }, { "characterFormat": { "fontFamily": "Verdana" }, "text": " " }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": { "fontFamily": "Verdana" }, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 542.5999755859375, "preferredWidthType": "Point", "cellWidth": 542.5999755859375, "columnSpan": 2, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }], "rowFormat": { "height": 125.05000305175781, "allowBreakAcrossPages": true, "heightType": "AtLeast", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point" } }], "grid": [261.8999938964844, 280.6999816894531], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": -3.5999999046325684, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 3.5, "leftMargin": 3.5, "bottomMargin": 0, "preferredWidth": 542.5999755859375, "preferredWidthType": "Point", "bidi": false, "allowAutoFit": true }, "description": null, "title": null }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 10, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('import section, character and paragraph Bidi validation', () => {
    let editor: DocumentEditor;
    let documentHelper :DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        sections = editor.parser.convertJsonToDocument(JSON.stringify(charParaBidi));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper= undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('section format Bidi validation', () => {
console.log('section format Bidi validation');
        expect((sections[0] as any).sectionFormat.bidi).toBe(true);
    });
    it('character format Bidi validation', () => {
console.log('character format Bidi validation');
        expect((sections[0] as any).childWidgets[0].characterFormat.bidi).toBe(true);
    });
    it('character format Bdo validation', () => {
console.log('character format Bdo validation');
        expect((sections[0] as any).childWidgets[1].childWidgets[0].children[0].characterFormat.bdo).toBe('RTL');
    });
    it('Paragraph format Bidi validation', () => {
console.log('Paragraph format Bidi validation');
        expect((sections[0] as any).childWidgets[2].paragraphFormat.bidi).toBe(true);
    });
});

describe('import Table format Bidi validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        sections = editor.parser.convertJsonToDocument(JSON.stringify(tableBidi));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper= undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table format Bidi validation', () => {
console.log('Table format Bidi validation');
        expect((sections[0] as any).childWidgets[0].tableFormat.bidi).toBe(true);
    });
});

describe('import page break inside table validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper= undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Page break inside table open validation', () => {
console.log('Page break inside table open validation');
        expect(() => { editor.open(JSON.stringify(pageBreak)); }).not.toThrowError();
    });
});


let tab: any = {
    "sections": [
        {
            "blocks": [
                {
                    "inlines": [
                        {
                            "text": "\t"
                        }
                    ]
                }
            ]
        }
    ],
    "defaultTabWidth": 56.0
};
let chart: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"chartLegend":{"position":"Bottom","chartTitleArea":{"fontName":"+mn-lt","fontSize":9,"layout":{"layoutX":0,"layoutY":0},"dataFormat":{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"808080","rgb":"#808080"}}}},"chartTitleArea":{"fontName":"+mn-lt","fontSize":14,"layout":{"layoutX":0,"layoutY":0},"dataFormat":{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"000000","rgb":"#000000"}}},"chartArea":{"foreColor":"#FFFFFFFF"},"plotArea":{"foreColor":"#000000FF"},"chartCategory":[{"chartData":[{"yValue":4.3},{"yValue":2.4},{"yValue":2}],"categoryXName":"Category 1"},{"chartData":[{"yValue":2.5},{"yValue":4.4},{"yValue":2}],"categoryXName":"Category 2"},{"chartData":[{"yValue":3.5},{"yValue":1.8},{"yValue":3}],"categoryXName":"Category 3"},{"chartData":[{"yValue":4.5},{"yValue":2.8},{"yValue":5}],"categoryXName":"Category 4"}],"chartSeries":[{"dataPoints":[{"fill":{"foreColor":"4472c4","rgb":"#4472c4"},"line":{"color":"000000","rgb":"#000000"}}],"seriesName":"Series 1","dataLabel":{"position":"Outside","fontName":"+mn-lt","fontColor":"404040","fontSize":9,"isLegendKey":false,"isBubbleSize":false,"isCategoryName":false,"isSeriesName":false,"isValue":true,"isPercentage":false,"isLeaderLines":false},"errorBar":{"type":"StandardError","direction":"Both","endStyle":"Cap","errorValue":10},"trendLines":[{"name":"Linear (Series 1)","type":"Linear","forward":0,"backward":0,"intercept":2,"isDisplayEquation":true,"isDisplayRSquared":true}]},{"dataPoints":[{"fill":{"foreColor":"ed7d31","rgb":"#ed7d31"},"line":{"color":"000000","rgb":"#000000"}}],"seriesName":"Series 2","dataLabel":{"position":"Outside","fontName":"+mn-lt","fontColor":"404040","fontSize":9,"isLegendKey":false,"isBubbleSize":false,"isCategoryName":false,"isSeriesName":false,"isValue":true,"isPercentage":false,"isLeaderLines":false},"errorBar":{"type":"StandardError","direction":"Both","endStyle":"Cap","errorValue":10}},{"dataPoints":[{"fill":{"foreColor":"a5a5a5","rgb":"#a5a5a5"},"line":{"color":"000000","rgb":"#000000"}}],"seriesName":"Series 3","dataLabel":{"position":"Outside","fontName":"+mn-lt","fontColor":"404040","fontSize":9,"isLegendKey":false,"isBubbleSize":false,"isCategoryName":false,"isSeriesName":false,"isValue":true,"isPercentage":false,"isLeaderLines":false},"errorBar":{"type":"StandardError","direction":"Both","endStyle":"Cap","errorValue":10}}],"chartPrimaryCategoryAxis":{"chartTitle":null,"chartTitleArea":{"layout":{},"dataFormat":{"fill":{},"line":{}}},"categoryType":"Automatic","fontSize":9,"fontName":"+mn-lt","numberFormat":"General","maximumValue":0,"minimumValue":0,"majorUnit":0,"hasMajorGridLines":false,"hasMinorGridLines":false,"majorTickMark":"TickMark_None","minorTickMark":"TickMark_None","tickLabelPosition":"TickLabelPosition_NextToAxis"},"chartPrimaryValueAxis":{"chartTitle":null,"chartTitleArea":{"layout":{},"dataFormat":{"fill":{},"line":{}}},"fontSize":9,"fontName":"+mn-lt","maximumValue":6,"minimumValue":0,"majorUnit":1,"hasMajorGridLines":true,"hasMinorGridLines":false,"majorTickMark":"TickMark_None","minorTickMark":"TickMark_None","tickLabelPosition":"TickLabelPosition_NextToAxis"},"chartTitle":"ClusterBar","chartType":"Bar_Clustered","gapWidth":182,"overlap":0,"height":252,"width":432},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[]};
let lineChart: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"chartLegend":{"position":"Bottom","chartTitleArea":{"fontName":"+mn-lt","fontSize":9,"layout":{"layoutX":0,"layoutY":0},"dataFormat":{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"808080","rgb":"#808080"}}}},"chartTitleArea":{"fontName":"+mn-lt","fontSize":14,"layout":{"layoutX":0,"layoutY":0},"dataFormat":{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"000000","rgb":"#000000"}}},"chartArea":{"foreColor":"#FFFFFFFF"},"plotArea":{"foreColor":"#000000FF"},"chartCategory":[{"chartData":[{"yValue":4.3},{"yValue":2.4},{"yValue":2}],"categoryXName":"Category 1"},{"chartData":[{"yValue":2.5},{"yValue":4.4},{"yValue":2}],"categoryXName":"Category 2"},{"chartData":[{"yValue":3.5},{"yValue":1.8},{"yValue":3}],"categoryXName":"Category 3"},{"chartData":[{"yValue":4.5},{"yValue":2.8},{"yValue":5}],"categoryXName":"Category 4"}],"chartSeries":[{"dataPoints":[{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"4472c4","rgb":"#4472c4"}}],"seriesName":"Series 1","seriesFormat":{"markerStyle":"Circle","markerSize":5,"markerColor":"ff4472c4"}},{"dataPoints":[{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"ed7d31","rgb":"#ed7d31"}}],"seriesName":"Series 2","seriesFormat":{"markerStyle":"Circle","markerSize":5,"markerColor":"ffed7d31"}},{"dataPoints":[{"fill":{"foreColor":"000000","rgb":"#000000"},"line":{"color":"a5a5a5","rgb":"#a5a5a5"}}],"seriesName":"Series 3","seriesFormat":{"markerStyle":"Circle","markerSize":5,"markerColor":"ffa5a5a5"}}],"chartPrimaryCategoryAxis":{"chartTitle":null,"chartTitleArea":{"layout":{},"dataFormat":{"fill":{},"line":{}}},"categoryType":"Automatic","fontSize":9,"fontName":"+mn-lt","numberFormat":"General","maximumValue":0,"minimumValue":0,"majorUnit":0,"hasMajorGridLines":false,"hasMinorGridLines":false,"majorTickMark":"TickMark_None","minorTickMark":"TickMark_None","tickLabelPosition":"TickLabelPosition_NextToAxis"},"chartPrimaryValueAxis":{"chartTitle":null,"chartTitleArea":{"layout":{},"dataFormat":{"fill":{},"line":{}}},"fontSize":9,"fontName":"+mn-lt","maximumValue":6,"minimumValue":0,"majorUnit":1,"hasMajorGridLines":true,"hasMinorGridLines":false,"majorTickMark":"TickMark_None","minorTickMark":"TickMark_None","tickLabelPosition":"TickLabelPosition_NextToAxis"},"chartTitle":"Chart Title","chartType":"Line_Markers","gapWidth":0,"overlap":0,"height":252,"width":432},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"ReadOnly","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[]};
describe('Default tab width validation and export validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('check default tab width', () => {
console.log('check default tab width');
        editor.open(JSON.stringify(tab));
        expect(editor.documentHelper.defaultTabWidth).toBe(56);
    });
    it('open blank default tab width', () => {
console.log('open blank default tab width');
        editor.openBlank();
        expect(editor.documentHelper.defaultTabWidth).toBe(36);
    });
    it('open chart', () => {
console.log('open chart');
        editor.open(JSON.stringify(chart));
    });
    it('open Line chart', () => {
console.log('open Line chart');
        editor.open(JSON.stringify(lineChart));
    });
});

let format_restrict = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "afterSpacing": 30.0,
                        "styleName": "Heading 1"
                    },
                    "inlines": [
                        {
                            "text": "Adventure Works Cycles"
                        }
                    ]
                }
            ]
        }
    ],
    "formatting": true,
    "protectionType": "NoProtection",
    "enforcement": true,
    "hashValue": "eVoNOXijTwRG8BOdeNzDDfHsmd+qOT/aaKgI8NhmnXkKJcCxatJyWYaED+5RG52qgIXFlcAVQvQPp0EqPDskjg==",
    "saltValue": "Qb4b+Mg0aedgk8Al1wNpLQ=="
};

let without_format_restrict = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "afterSpacing": 30.0,
                        "styleName": "Heading 1"
                    },
                    "inlines": [
                        {
                            "text": "Adventure Works Cycles"
                        }
                    ]
                }
            ]
        }
    ],
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "hashValue": "eVoNOXijTwRG8BOdeNzDDfHsmd+qOT/aaKgI8NhmnXkKJcCxatJyWYaED+5RG52qgIXFlcAVQvQPp0EqPDskjg==",
    "saltValue": "Qb4b+Mg0aedgk8Al1wNpLQ=="
};
describe('restrict editing feature formatting validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper= editor.documentHelper;
        editor.open(JSON.stringify(format_restrict));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper= undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Formatting restriction validation', () => {
console.log('Formatting restriction validation');
        expect(editor.documentHelper.restrictFormatting).toBe(true);
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it(' without Formatting restriction validation', () => {
console.log(' without Formatting restriction validation');
        editor.open(JSON.stringify(without_format_restrict));
        expect(editor.documentHelper.restrictFormatting).toBe(false);
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
    }, 200);
});

let edit_readonly = {
    "sections": [
        {
            "blocks": [
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Hello word,"
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "editRangeId": "627587516",
                            "group": "everyone"
                        },
                        {
                            "text": "This from Suriya."
                        },
                        {
                            "editRangeId": "627587516",
                            "editableRangeStart": {
                                "editRangeId": "627587516",
                                "group": "everyone"
                            }
                        }
                    ]
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Protected from e"
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
                            "text": "diting"
                        }
                    ]
                }
            ]
        }
    ],
    "formatting": false,
    "protectionType": "ReadOnly",
    "enforcement": true,
    "hashValue": "a4ntS1Ca8S7ltINO8o9diMl91O9OcKm2WsI1vKiQhNtaUsQY2SVBe23OUuSg2kkNJN9Usj11/UCa4oMFYtzAlA==",
    "saltValue": "djMAIQcobGK07uT6YaP+Ww=="
};

let edit_restrict_table = {
    "sections": [
        {
            "blocks": [
                {
                    "rows": [
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast"
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Sample"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Sample2"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1
                                    }
                                }
                            ]
                        },
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast"
                            },
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
                                                    "editRangeId": "1805148856",
                                                    "user": "sample@gmail.com"
                                                },
                                                {
                                                    "editRangeId": "1390048315",
                                                    "user": "helo@gmail.com"
                                                },
                                                {
                                                    "text": "Sample3"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Sampl4"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true
                                    }
                                }
                            ]
                        }
                    ],
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0.0,
                        "tableAlignment": "Left",
                        "preferredWidthType": "Auto",
                        "borders": {
                            "left": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "right": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "top": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "bottom": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "vertical": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "horizontal": {
                                "lineStyle": "Single",
                                "lineWidth": 0.5,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalDown": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            },
                            "diagonalUp": {
                                "lineStyle": "None",
                                "lineWidth": 0.0,
                                "shadow": false,
                                "space": 0.0,
                                "hasNoneStyle": false
                            }
                        },
                        "bidi": false
                    }
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Sam"
                        },
                        {
                            "name": "_GoBack",
                            "bookmarkType": 1
                        },
                        {
                            "editRangeId": "1805148856",
                            "editableRangeStart": {
                                "editRangeId": "1805148856",
                                "user": "sample@gmail.com"
                            }
                        },
                        {
                            "editRangeId": "1390048315",
                            "editableRangeStart": {
                                "editRangeId": "1390048315",
                                "user": "helo@gmail.com"
                            }
                        },
                        {
                            "text": "ple"
                        }
                    ]
                }
            ]
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "protectionType": "NoProtection",
    "enforcement": false
};
describe('restrict editing feature- editing validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper= editor.documentHelper;
        editor.open(JSON.stringify(edit_readonly));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Edit readonly with everyone validation', () => {
console.log('Edit readonly with everyone validation');
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(3);
        expect((lineWidget.children[0] as EditRangeStartElementBox).group).toBe('Everyone');
    });
    it('Edit readonly with single user validation validation', () => {
console.log('Edit readonly with single user validation validation');
        editor.open(JSON.stringify(edit_restrict_table));
        expect(editor.documentHelper.protectionType).toBe('NoProtection');
        expect(editor.documentHelper.isDocumentProtected).toBe(false);
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(5);
        expect((lineWidget.children[2] as EditRangeEndElementBox).editRangeStart.user).toBe('sample@gmail.com');
    });
});

let fieldData: any = {
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
						"listFormat": {}
					},
					"characterFormat": {
						"highlightColor": "NoColor"
					},
					"inlines": [
						{
							"characterFormat": {
								"highlightColor": "NoColor",
								"bidi": false
							},
							"text": "Test "
						},
						{
							"characterFormat": {},
							"bookmarkType": 0,
							"name": "tag_Group.Name_8eed407e-719e-49f0-9e1a-ab4761e29e9f"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": true,
								"underline": "Single"
							},
							"fieldType": 0
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": true,
								"underline": "Single",
								"highlightColor": "#B1D3F3"
							},
							"text": "MERGEFIELD Group.Name"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": true,
								"underline": "Single"
							},
							"fieldType": 2
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": true,
								"underline": "Single",
								"highlightColor": "#B1D3F3"
							},
							"text": "#Group.Name"
						},
						{
							"characterFormat": {
								"bold": true,
								"italic": true,
								"underline": "Single"
							},
							"fieldType": 1
						},
						{
							"characterFormat": {},
							"bookmarkType": 1,
							"name": "tag_Group.Name_8eed407e-719e-49f0-9e1a-ab4761e29e9f"
						},
						{
							"characterFormat": {
								"bidi": false
							},
							"text": " b"
						}
					]
				}
			],
			"headersFooters": {
				"header": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"footer": {
					"blocks": [
						{
							"paragraphFormat": {
								"listFormat": {}
							},
							"characterFormat": {},
							"inlines": []
						}
					]
				},
				"evenHeader": {},
				"evenFooter": {},
				"firstPageHeader": {},
				"firstPageFooter": {}
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
		"fontFamilyBidi": "Calibri"
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
				"listFormat": {}
			},
			"characterFormat": {},
			"next": "Normal"
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
				"lineSpacing": 1.0791666507720948,
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
			"name": "Default Paragraph Font",
			"type": "Character",
			"characterFormat": {}
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
				"lineSpacing": 1.0791666507720948,
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
				"lineSpacing": 1.0791666507720948,
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
				"lineSpacing": 1.0791666507720948,
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
				"lineSpacing": 1.0791666507720948,
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
				"lineSpacing": 1.0791666507720948,
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

describe('field character format validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(fieldData);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Field character validation', () => {
console.log('Field character validation');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fiedElement: FieldElementBox = lineWidget.children[2] as FieldElementBox;
        expect(fiedElement.characterFormat.bold).toBe(true);
        expect(fiedElement.characterFormat.italic).toBe(true);
        expect(fiedElement.characterFormat.underline).toBe('Single');
    });
});
describe("Paste style Validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
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
        }, 500);
    });
    it('Default style paste validation', () => {
console.log('Default style paste validation');
        //if already style is there in collection with same name it should not be added.
        let json = {"name":"onSuccess","data":{"sections":[{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left","styleName":"Heading 1","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Syncfusion","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Heading 1","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false},"readyState":4,"status":200};
        editor.openBlank();
        editor.editor.pasteFormattedContent(json);
        expect(editor.documentHelper.styles.length).toBe(14);
    });
    it('Custom style paste validation', () => {
console.log('Custom style paste validation');
        let json = {"name":"onSuccess","data":{"sections":[{"blocks":[{"characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":22,"fontFamily":"Algerian","fontColor":"#00B0F0FF","bidi":false,"fontSizeBidi":22,"fontFamilyBidi":"Algerian"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left","styleName":"Sync","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Syncfusion","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":22,"fontFamily":"Algerian","fontColor":"#00B0F0FF","bidi":false,"fontSizeBidi":22,"fontFamilyBidi":"Algerian"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Sync","basedOn":"Normal","next":"Sync","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":22,"fontFamily":"Algerian","fontColor":"#00B0F0FF","bidi":false,"fontSizeBidi":22,"fontFamilyBidi":"Algerian"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left"}},{"type":"Character","name":"Sync Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":true,"italic":false,"strikethrough":"None","fontSize":22,"fontFamily":"Algerian","fontColor":"#00B0F0FF","bidi":false,"fontSizeBidi":22,"fontFamilyBidi":"Algerian"}}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false},"readyState":4,"status":200};
        editor.openBlank();
        editor.editor.pasteFormattedContent(json);
        expect(editor.documentHelper.styles.length).toBe(16);
        editor.editor.pasteFormattedContent(json);
        expect(editor.documentHelper.styles.length).toBe(16);
    });
});
let formFieldData: any = {
    "sections": [
      {
        "blocks": [
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option4", "option5" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 2 },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Name :" },
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
                    "defaultValue": "SYNCFUSION",
                    "format": ""
                  }
                },
                "fieldType": 0
              },
              {
                "name": "Text1",
                "bookmarkType": 0
              },
              { "text": " FORMTEXT " },
              { "fieldType": 2 },
              { "text": "SYNCFUSION" },
              { "fieldType": 1 },
              {
                "name": "_GoBack",
                "bookmarkType": 0
              },
              {
                "name": "Text1",
                "bookmarkType": 1
              },
              {
                "name": "_GoBack",
                "bookmarkType": 1
              }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Check " },
              { "text": "box :" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "Check1",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "checkBox": {
                    "size": 20,
                    "defaultValue": false
                  }
                },
                "fieldType": 0
              },
              {
                "name": "Check1",
                "bookmarkType": 0
              },
              { "text": " FORMCHECKBOX " },
              { "fieldType": 2 },
              { "fieldType": 1 },
              {
                "name": "Check1",
                "bookmarkType": 1
              }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": " Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "Dropdown1",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option4", "option5" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              {
                "name": "Dropdown1",
                "bookmarkType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 2 },
              { "fieldType": 1 },
              {
                "name": "Dropdown1",
                "bookmarkType": 1
              }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option5", "option4" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Name :" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "textInput": {
                    "type": "Text",
                    "maxLength": 0,
                    "defaultValue": "5,000",
                    "format": "#,##0"
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMTEXT " },
              { "fieldType": 2 },
              { "text": "5,000" },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Check " },
              { "text": "box :" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "Check1",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "checkBox": {
                    "size": 20,
                    "defaultValue": true
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMCHECKBOX " },
              { "fieldType": 2 },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": " Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "Dropdown1",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option4", "option5" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 2 },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option4", "option5" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 2 },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Name :" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "textInput": {
                    "type": "Text",
                    "maxLength": 0,
                    "defaultValue": "5/6/2020",
                    "format": "M/d/yyyy"
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMTEXT " },
              { "fieldType": 2 },
              { "text": "5/6/2020" },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": "Check " },
              { "text": "box :" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "checkBox": {
                    "size": 20,
                    "defaultValue": false
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMCHECKBOX " },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": [
              { "text": " Drop-down" },
              {
                "hasFieldEnd": true,
                "formFieldData": {
                  "name": "Dropdown1",
                  "enabled": true,
                  "helpText": "",
                  "statusText": "",
                  "dropDownList": {
                    "dropDownItems": [ "option3", "option4", "option5" ],
                    "selectedIndex": 0
                  }
                },
                "fieldType": 0
              },
              { "text": " FORMDROPDOWN " },
              { "fieldType": 2 },
              { "fieldType": 1 }
            ]
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
          },
          {
            "paragraphFormat": { "styleName": "Normal" },
            "inlines": []
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
    "background": { "color": "#FFFFFFFF" },
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
    "enforcement": false
  };
  let form: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"inlines":[{"characterFormat":{"fontColor":"#00000000"},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"Text1"},{"characterFormat":{"fontColor":"#00000000"},"text":" FORMTEXT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"Text1"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"#00000000"}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]};
  let form1: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"inlines":[{"characterFormat":{"fontColor":"#00000000"},"fieldType":0,"hasFieldEnd":true,"formFieldData":{"name":"Text1","enabled":true,"helpText":"","statusText":"","textInput":{"type":"Text","maxLength":0,"defaultValue":"","format":""}}},{"characterFormat":{},"bookmarkType":0,"name":"Text1"},{"characterFormat":{"fontColor":"#00000000"},"text":" FORMTEXT "},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{"fontColor":"#00000000"},"text":" "},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"Text1"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"#00000000"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"#00000000"}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496FF"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763FF"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[]};
  describe('form field validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(formFieldData);
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Text formfield validation', () => {
console.log('Text formfield validation');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fieldElement: FieldElementBox = lineWidget.children[1] as FieldElementBox;
        let formFieldData: TextFormField = new TextFormField();
        fieldElement.formFieldData = formFieldData;
        expect((fieldElement.formFieldData as TextFormField).type).toBe('Text');
        expect((fieldElement.formFieldData as TextFormField).maxLength).toBe(0);
        expect((fieldElement.formFieldData as TextFormField).defaultValue).toBe('');
        expect((fieldElement.formFieldData as TextFormField).format).toBeNull;
    });
    it('Checkbox formfield validation', () => {
console.log('Checkbox formfield validation');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fieldElement: FieldElementBox = lineWidget.children[2] as FieldElementBox;
        let formFieldData: TextFormField = new TextFormField();
        fieldElement.formFieldData = formFieldData;
        expect((fieldElement.formFieldData as CheckBoxFormField).size).toBe(undefined);
       // expect((fieldElement.formFieldData as CheckBoxFormField).defaultValue).toBe('');
    });
    it('Dropdown formfield validation', () => {
console.log('Dropdown formfield validation');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fieldElement: FieldElementBox = lineWidget.children[0] as FieldElementBox;
        let formFieldData: TextFormField = new TextFormField();
        fieldElement.formFieldData = formFieldData;
        expect((fieldElement.formFieldData as DropDownFormField).selectedIndex).toBe(undefined);
        expect((fieldElement.formFieldData as DropDownFormField).dropdownItems).toString;
    });
    it('Apply shading true validation', () => {
console.log('Apply shading true validation');
        editor.open(form1);      
        expect(editor.documentEditorSettings.formFieldSettings.applyShading).toBe(false);
    });
    it('Apply shading false validation', () => {
console.log('Apply shading false validation');
        editor.open(form);      
        expect(editor.documentEditorSettings.formFieldSettings.applyShading).toBe(true);
    });
});
let contentControlJson: any = {
    "sections": [
        {
            "blocks": [
                {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "styleName": "Normal"
                            },
                            "inlines": [
                                {
                                    "text": "BlockContentControl"
                                }
                            ]
                        }
                    ],
                    "contentControlProperties": {
                        "lockContentControl": false,
                        "lockContents": false,
                        "color": "#00000000",
                        "type": "RichText",
                        "hasPlaceHolderText": false,
                        "multiline": false,
                        "isTemporary": false,
                        "dateCalendarType": "Gregorian",
                        "isChecked": false
                    }
                },
                {
                    "blocks": [
                        {
                            "rows": [
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0.0,
                                        "heightType": "AtLeast"
                                    },
                                    "cells": [
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": [
                                                        {
                                                            "text": "Cell 1"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "cellWidth": 233.75
                                            }
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
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                },
                                {
                                    "rowFormat": {
                                        "allowBreakAcrossPages": true,
                                        "isHeader": false,
                                        "height": 0.0,
                                        "heightType": "AtLeast"
                                    },
                                    "cells": [
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
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "cellWidth": 233.75
                                            }
                                        },
                                        {
                                            "blocks": [
                                                {
                                                    "paragraphFormat": {
                                                        "styleName": "Normal"
                                                    },
                                                    "inlines": [
                                                        {
                                                            "text": "Cell 4"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "cellFormat": {
                                                "columnSpan": 1,
                                                "rowSpan": 1,
                                                "preferredWidth": 233.75,
                                                "preferredWidthType": "Point",
                                                "verticalAlignment": "Top",
                                                "isSamePaddingAsTable": true,
                                                "cellWidth": 233.75
                                            }
                                        }
                                    ]
                                }
                            ],
                            "title": null,
                            "description": null,
                            "tableFormat": {
                                "allowAutoFit": true,
                                "leftIndent": 0.0,
                                "tableAlignment": "Left",
                                "preferredWidthType": "Auto",
                                "bidi": false
                            }
                        }
                    ],
                    "contentControlProperties": {
                        "lockContentControl": false,
                        "lockContents": false,
                        "color": "#00000000",
                        "type": "RichText",
                        "hasPlaceHolderText": false,
                        "multiline": false,
                        "isTemporary": false,
                        "dateCalendarType": "Gregorian",
                        "isChecked": false
                    }
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": [
                        {
                            "text": "Inline"
                        },
                        {
                            "inlines": [
                                {
                                    "text": "ContentControl"
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "color": "#00000000",
                                "type": "RichText",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "isChecked": false
                            }
                        },
                        {
                            "text": "     "
                        },
                        {
                            "text": "CheckBox"
                        },
                        {
                            "inlines": [
                                {
                                    "text": "☐",
                                    "characterFormat": {
                                        "fontFamily": "MS Gothic"
                                    }
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "color": "#00000000",
                                "type": "CheckBox",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "isChecked": false,
                                "uncheckedState": {
                                    "font": "MS Gothic",
                                    "value": "☐"
                                },
                                "checkedState": {
                                    "font": "MS Gothic",
                                    "value": "☒"
                                }
                            }
                        },
                        {
                            "text": "      "
                        },
                        {
                            "text": "Date"
                        },
                        {
                            "inlines": [
                                {
                                    "text": "7/23/2020"
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "color": "#00000000",
                                "type": "Date",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "dateStorageFormat": "DateStorageDateTime",
                                "dateDisplayLocale": "en_US",
                                "dateDisplayFormat": "M/d/yyyy",
                                "isChecked": false
                            }
                        },
                        {
                            "text": "     "
                        },
                        {
                            "text": "ComboBox"
                        },
                        {
                            "inlines": [
                                {
                                    "text": "Test 1"
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "color": "#00000000",
                                "type": "ComboBox",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "isChecked": false,
                                "contentControlListItems": [
                                    {
                                        "displayText": "Test 1",
                                        "value": "Sync"
                                    },
                                    {
                                        "displayText": "Test 2",
                                        "value": "Test 2"
                                    }
                                ]
                            }
                        },
                        {
                            "text": "Content Control"
                        }
                    ]
                },
                {
                    "rows": [
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast"
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Row Content Control"
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
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "cellWidth": 233.75
                                    }
                                },
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "e"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "cellWidth": 233.75
                                    }
                                }
                            ],
                            "contentControlProperties": {
                                "lockContentControl": false,
                                "lockContents": false,
                                "color": "#00000000",
                                "type": "RichText",
                                "hasPlaceHolderText": false,
                                "multiline": false,
                                "isTemporary": false,
                                "dateCalendarType": "Gregorian",
                                "isChecked": false
                            }
                        },
                        {
                            "rowFormat": {
                                "allowBreakAcrossPages": true,
                                "isHeader": false,
                                "height": 0.0,
                                "heightType": "AtLeast"
                            },
                            "cells": [
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
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "cellWidth": 233.75
                                    }
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
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 233.75,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "cellWidth": 233.75
                                    }
                                }
                            ]
                        }
                    ],
                    "title": null,
                    "description": null,
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0.0,
                        "tableAlignment": "Left",
                        "preferredWidthType": "Auto",
                        "bidi": false
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
                                "height": 0.0,
                                "heightType": "AtLeast"
                            },
                            "cells": [
                                {
                                    "blocks": [
                                        {
                                            "paragraphFormat": {
                                                "styleName": "Normal"
                                            },
                                            "inlines": [
                                                {
                                                    "text": "Cell Content Control"
                                                }
                                            ]
                                        }
                                    ],
                                    "cellFormat": {
                                        "columnSpan": 1,
                                        "rowSpan": 1,
                                        "preferredWidth": 467.5,
                                        "preferredWidthType": "Point",
                                        "verticalAlignment": "Top",
                                        "isSamePaddingAsTable": true,
                                        "cellWidth": 467.5
                                    },
                                    "contentControlProperties": {
                                        "lockContentControl": false,
                                        "lockContents": false,
                                        "color": "#00000000",
                                        "type": "RichText",
                                        "hasPlaceHolderText": false,
                                        "multiline": false,
                                        "isTemporary": false,
                                        "dateCalendarType": "Gregorian",
                                        "isChecked": false
                                    }
                                }
                            ]
                        }
                    ],
                    "title": null,
                    "description": null,
                    "tableFormat": {
                        "allowAutoFit": true,
                        "leftIndent": 0.0,
                        "tableAlignment": "Left",
                        "preferredWidthType": "Auto",
                        "bidi": false
                    }
                },
                {
                    "paragraphFormat": {
                        "styleName": "Normal"
                    },
                    "inlines": []
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
        },
        {
            "type": "Character",
            "name": "Placeholder Text",
            "basedOn": "Default Paragraph Font",
            "characterFormat": {
                "fontColor": "#808080FF"
            }
        }
    ],
    "defaultTabWidth": 36.0,
    "formatting": false,
    "trackChanges": false,
    "protectionType": "NoProtection",
    "enforcement": false,
    "dontUseHTMLParagraphAutoSpacing": false
}
describe('Content Control Validation', () => {
    let editor: DocumentEditor;
    let documentHelper:DocumentHelper;
    let blocks: BlockWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(contentControlJson);
        blocks = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets as BlockWidget[];
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Block Content Control', () => {
console.log('Block Content Control');
        let cntntCtrlWidget: ContentControlWidgetType = 'Block';
        expect(blocks[0].contentControlProperties.contentControlWidgetType).toBe(cntntCtrlWidget);
        expect(blocks[0].contentControlProperties).toBe(((blocks[0].childWidgets[0] as LineWidget).children[0] as ElementBox).contentControlProperties);
        expect(blocks[0].contentControlProperties).toBe(((blocks[0].childWidgets[0] as LineWidget).children[2] as ElementBox).contentControlProperties);
        expect(((blocks[0].childWidgets[0] as LineWidget).children[0] as ContentControl).type).toBe(0);
        expect(((blocks[0].childWidgets[0] as LineWidget).children[2] as ContentControl).type).toBe(1);
    });
    it('Table in Block Content Control', () => {        
console.log('Table in Block Content Control');
        let cntntCtrlWidget: ContentControlWidgetType = 'Block';
        expect(blocks[1].contentControlProperties.contentControlWidgetType).toBe(cntntCtrlWidget);
        let firstCell: TableCellWidget = (blocks[1].childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget;
        let lastCell: TableCellWidget = (blocks[1].childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget;
        expect(blocks[1].contentControlProperties).toBe((((firstCell.childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget).children[0] as ElementBox).contentControlProperties);
        expect(blocks[1].contentControlProperties).toBe((((lastCell.childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget).children[1] as ElementBox).contentControlProperties);
        expect((((firstCell.childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget).children[0] as ContentControl).type).toBe(0);
        expect((((lastCell.childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget).children[1] as ContentControl).type).toBe(1);
    });
    it('Inline Content Control', () => {
console.log('Inline Content Control');
        let cntntCtrlWidget: ContentControlWidgetType = 'Inline';
        let cntnCtrlType: ContentControlType = 'CheckBox';
        expect((blocks[3].childWidgets[0] as LineWidget).children[2].contentControlProperties.contentControlWidgetType).toBe(cntntCtrlWidget);
        expect((blocks[3].childWidgets[0] as LineWidget).children[2].contentControlProperties.checkedState).toBeUndefined;
        let element: ElementBox = (blocks[3].childWidgets[0] as LineWidget).children[7];
        expect(element.contentControlProperties.type).toBe(cntnCtrlType);
        expect(element.contentControlProperties.checkedState).toBeDefined;
        expect(element.contentControlProperties.uncheckedState).toBeDefined;
        element = (blocks[3].childWidgets[0] as LineWidget).children[12];
        cntnCtrlType = 'Date';
        expect(element.contentControlProperties.type).toBe(cntnCtrlType);
        expect(element.contentControlProperties.dateCalendarType).toBeDefined;
        element = (blocks[3].childWidgets[0] as LineWidget).children[17];
        cntnCtrlType = 'ComboBox';
        expect(element.contentControlProperties.type).toBe(cntnCtrlType);
        expect(element.contentControlProperties.contentControlListItems.length).toBe(2);
    });
});
let shapeWithImagePos:any = {
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
                    "characterFormat": {
                        "fontSize": null,
                        "fontColor": "empty"
                    },
                    "inlines": [
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "bookmarkType": 0,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "bookmarkType": 1,
                            "name": "_GoBack"
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 23,
                            "name": "TextBox 22",
                            "visible": true,
                            "width": 256.25,
                            "height": 200.25,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 72.75,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251672576,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": 16,
                                            "fontFamily": "KG Beautiful Every Time",
                                            "underline": "Single",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontSizeBidi": 16,
                                            "fontFamilyBidi": "KG Beautiful Every Time"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 16,
                                                    "fontFamily": "KG Beautiful Every Time",
                                                    "underline": "Single",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 16,
                                                    "fontFamilyBidi": "KG Beautiful Every Time"
                                                },
                                                "text": "CASEL Core Competencies"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Miss Kindergarten",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Miss Kindergarten"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Self-Awareness"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": 9,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontSizeBidi": 9,
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "(Identify Emotions, Accurate Self-Perceptions, Recognize Strengths, "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Self-Confidence, Self-Efficacy)"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Miss Kindergarten",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Miss Kindergarten"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Social Awareness"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "("
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Perspective-Taking, Empathy, "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Appreciating Diversity, Respect for Others"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": ")"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Miss Kindergarten",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Miss Kindergarten"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Self-Management"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "(Impulse Control, Stress Management, "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Self-Discipline, Self-Motivation, Goal-Setting, Organizational Skills)"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Miss Kindergarten",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Miss Kindergarten"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Relationship Skills"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "("
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Communication, Social Engagement, "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Relationship-Building, Teamwork"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": ")"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Miss Kindergarten",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Miss Kindergarten"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Responsible Decision-Making"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "("
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Identifying Problems, Analyzing Solutions, Solving Problems, Evaluating, "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Reflecting, Ethical Responsibility"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 8,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 8,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": ")"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "empty",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 19,
                            "name": "TextBox 18",
                            "visible": true,
                            "width": 213,
                            "height": 92.25,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": -18,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251661312,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG I Need A Font",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG I Need A Font"
                                                },
                                                "text": "Objective"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG I Need A Font",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG I Need A Font"
                                                },
                                                "text": "/I-Statement"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "Students will be able to "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "describe "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "positive "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "relationships."
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Thinking Out Loud",
                                            "fontColor": "empty",
                                            "fontFamilyBidi": "KG Thinking Out Loud"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "I understand the importance of positive "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "relationships."
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 30,
                            "name": "TextBox 29",
                            "visible": true,
                            "width": 531.9,
                            "height": 173.25,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 471.75,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Margin",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251676672,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": 14,
                                            "fontFamily": "KG Part of Me",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontSizeBidi": 14,
                                            "fontFamilyBidi": "KG Part of Me"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 16,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 16,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Evidence-Based Strategies"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": 14,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontSizeBidi": 14,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": 14,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontSizeBidi": 14,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Kinesthetic Games"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Building Vocabulary"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Interactive Games"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Complex cognitive tasks (investigation, problem-solving, and/or decision-making)"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Cooperative learning groups"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Practice, practice, practice"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "     "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Cues & questioning to check for understanding"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Modeling"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Summarizing to assess student knowledge"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Student Re-teaching"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Setting Clear Goals/Objectives"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Student Feedback"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Student discussion/chunking"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "bold": true,
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "boldBidi": true,
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☐"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": false,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "bold": true,
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "boldBidi": true,
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Teacher Feedback"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 2,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontColor": "empty",
                                            "boldBidi": true
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "inlines": [
                                                    {
                                                        "characterFormat": {
                                                            "fontSize": null,
                                                            "fontFamily": "ＭＳ ゴシック",
                                                            "fontColor": "#000000FF",
                                                            "fontFamilyBidi": "ＭＳ ゴシック"
                                                        },
                                                        "text": "☒"
                                                    }
                                                ],
                                                "contentControlProperties": {
                                                    "lockContentControl": false,
                                                    "lockContents": false,
                                                    "color": "#00000000",
                                                    "type": "CheckBox",
                                                    "hasPlaceHolderText": false,
                                                    "multiline": false,
                                                    "isTemporary": false,
                                                    "isChecked": true,
                                                    "uncheckedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☐"
                                                    },
                                                    "checkedState": {
                                                        "font": "MS Gothic",
                                                        "value": "☒"
                                                    },
                                                    "characterFormat": {
                                                        "fontSize": null,
                                                        "fontFamily": "KG Part of Me",
                                                        "fontColor": "#000000FF",
                                                        "fontFamilyBidi": "KG Part of Me"
                                                    },
                                                    "contentControlListItems": []
                                                }
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "KG Part of Me",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "KG Part of Me"
                                                },
                                                "text": "Engagement strategies"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": "\t"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "lineSpacing": 1.5,
                                            "lineSpacingType": "Multiple",
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": "            "
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 26,
                            "name": "TextBox 25",
                            "visible": true,
                            "width": 275.4,
                            "height": 139.2,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 107.25,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 223.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251667456,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG I Need A Font",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG I Need A Font"
                                                },
                                                "text": "Materials "
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Chart Paper & Marker"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "“"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "In a positive relationship, I…"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "” "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Interactive "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "PowerPoint "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "Activity"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": []
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "empty",
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 25,
                            "name": "TextBox 24",
                            "visible": true,
                            "width": 318.75,
                            "height": 126,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": -18,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 180,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251665408,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": 16,
                                            "fontColor": "empty",
                                            "fontSizeBidi": 16
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 16,
                                                    "fontFamily": "KG Beautiful Every Time",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 16,
                                                    "fontFamilyBidi": "KG Beautiful Every Time"
                                                },
                                                "text": "American School Counseling Association "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 16,
                                                    "fontFamily": "KG Beautiful Every Time",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 16,
                                                    "fontFamilyBidi": "KG Beautiful Every Time"
                                                },
                                                "text": "Standards (ASCA)"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": 16,
                                            "fontColor": "empty",
                                            "fontSizeBidi": 16
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "PS:A"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "2.8 Learn how to make and keep friends"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "\t"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 41,
                            "name": "TextBox 40",
                            "visible": true,
                            "width": 223.5,
                            "height": 78,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 627.75,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251678720,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Blank Space Solid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Blank Space Solid"
                                                },
                                                "text": "Assessment"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "italic": true,
                                            "fontSize": 10,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "#000000FF",
                                            "italicBidi": true,
                                            "fontSizeBidi": 10,
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "The students will "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "identify feelings that accompany "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "positive relationships."
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 28,
                            "name": "TextBox 27",
                            "visible": true,
                            "width": 531.65,
                            "height": 244.5,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 238,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Margin",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251671552,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": 14,
                                            "fontFamily": "KG Blank Space Solid",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontSizeBidi": 14,
                                            "fontFamilyBidi": "KG Blank Space Solid"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "      "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "\t"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Miss Kindy Chunky",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Miss Kindy Chunky"
                                                },
                                                "text": "    "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Blank Space Solid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Blank Space Solid"
                                                },
                                                "text": "Procedures"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": 14,
                                            "fontFamily": "KG Blank Space Solid",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontSizeBidi": 14,
                                            "fontFamilyBidi": "KG Blank Space Solid"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Blank Space Solid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Blank Space Solid"
                                                },
                                                "text": " "
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": 11,
                                            "fontFamily": "HelloTracerSolid",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontSizeBidi": 11,
                                            "fontFamilyBidi": "HelloTracerSolid"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "Start the lesson by asking the students "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "what is a positive relationship. Note down relevant ideas on the board. "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "Discuss students’ ideas, and explain that positive relationships are such that have trust, care, support, and "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "respect at its core. Talk about how such relationships can influence a person. Discuss benefits on different "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "areas of life: health, intellect, personal growth, etc. Ask the students for specific examples of reasons to have a "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "positive relationship."
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "bold": true,
                                            "fontSize": null,
                                            "fontFamily": "KG Thinking Out Loud",
                                            "fontColor": "#000000FF",
                                            "boldBidi": true,
                                            "fontFamilyBidi": "KG Thinking Out Loud"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "Introduce the interactive activity"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": ". "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": "All instructions are in the PowerPoint file. This activity will take around 15 "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11
                                                },
                                                "text": "–"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 11,
                                                    "fontFamily": "HelloTracerSolid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 11,
                                                    "fontFamilyBidi": "HelloTracerSolid"
                                                },
                                                "text": " 20 minutes."
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": []
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 42,
                            "name": "TextBox 41",
                            "visible": true,
                            "width": 308.25,
                            "height": 63,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": 642.75,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": 190.5,
                            "horizontalOrigin": "Column",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251680768,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontColor": "empty"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Beautiful Every Time",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Beautiful Every Time"
                                                },
                                                "text": "Additional Resources"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": null,
                                            "fontFamily": "KG Thinking Out Loud",
                                            "fontColor": "#000000FF",
                                            "fontFamilyBidi": "KG Thinking Out Loud"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "“"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "Positive Relationships feel …"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "” worksheet"
                                            }
                                        ]
                                    },
                                    {
                                        "paragraphFormat": {
                                            "textAlignment": "Right",
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {},
                                            "contextualSpacing": true
                                        },
                                        "characterFormat": {
                                            "fontSize": 10,
                                            "fontFamily": "KG Miss Kindergarten",
                                            "fontColor": "empty",
                                            "fontSizeBidi": 10,
                                            "fontFamilyBidi": "KG Miss Kindergarten"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "©20"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": "20"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 10,
                                                    "fontFamily": "KG Miss Kindergarten",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 10,
                                                    "fontFamilyBidi": "KG Miss Kindergarten"
                                                },
                                                "text": " www.schoolcounselorworld.com"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "shapeId": 3,
                            "name": "TextBox 2",
                            "visible": true,
                            "width": 531.75,
                            "height": 32.25,
                            "widthScale": 100,
                            "heightScale": 100,
                            "verticalPosition": -50.25,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -33,
                            "horizontalOrigin": "Margin",
                            "horizontalAlignment": "None",
                            "zOrderPosition": 251659264,
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
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
                                "color": "#00000000",
                                "weight": 3,
                                "lineStyle": "Solid",
                                "line": true
                            },
                            "textFrame": {
                                "textVerticalAlignment": "Top",
                                "leftMargin": 5.31525,
                                "rightMargin": 5.31525,
                                "topMargin": 2.76375,
                                "bottomMargin": 2.76375,
                                "blocks": [
                                    {
                                        "paragraphFormat": {
                                            "beforeSpacing": 0,
                                            "afterSpacing": 0,
                                            "styleName": "Normal (Web)",
                                            "listFormat": {}
                                        },
                                        "characterFormat": {
                                            "fontSize": 14,
                                            "fontFamily": "KG Thinking Out Loud",
                                            "fontColor": "#000000FF",
                                            "fontSizeBidi": 14,
                                            "fontFamilyBidi": "KG Thinking Out Loud"
                                        },
                                        "inlines": [
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Cold Coffee",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Cold Coffee"
                                                },
                                                "text": "Grade Level"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Cold Coffee",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Cold Coffee"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "K-1"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": "  "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Blank Space Solid",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Blank Space Solid"
                                                },
                                                "text": "Month"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "Tw Cen MT",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "Tw Cen MT"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "September"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "  "
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Cold Coffee",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Cold Coffee"
                                                },
                                                "text": "Topic"
                                            },
                                            {
                                                "characterFormat": {
                                                    "bold": true,
                                                    "fontSize": 14,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "boldBidi": true,
                                                    "fontSizeBidi": 14,
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": ":"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": " "
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": "Positive relationships"
                                            },
                                            {
                                                "characterFormat": {
                                                    "fontSize": null,
                                                    "fontFamily": "KG Thinking Out Loud",
                                                    "fontColor": "#000000FF",
                                                    "fontFamilyBidi": "KG Thinking Out Loud"
                                                },
                                                "text": " "
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "characterFormat": {
                                "fontSize": null,
                                "fontColor": "empty"
                            },
                            "fieldType": 0,
                            "hasFieldEnd": true
                        },
                        {
                            "characterFormat": {
                                "fontSize": null,
                                "fontColor": "empty"
                            },
                            "text": "HYPERLINK \"http://www.schoolcounselorworld.com\" "
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "fieldType": 2
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "imageString": "data:image/png;base64,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",
                            "isMetaFile": false,
                            "width": 76.67528,
                            "height": 76.67528,
                            "iscrop": false,
                            "name": "Picture 7",
                            "visible": true,
                            "widthScale": 41.55842,
                            "heightScale": 41.55842,
                            "verticalPosition": -66.42,
                            "verticalOrigin": "Paragraph",
                            "verticalAlignment": "None",
                            "horizontalPosition": -10.75,
                            "horizontalOrigin": "RightMargin",
                            "horizontalAlignment": "None",
                            "allowOverlap": true,
                            "textWrappingStyle": "InFrontOfText",
                            "textWrappingType": "Both",
                            "layoutInCell": true,
                            "zOrderPosition": 251681792
                        },
                        {
                            "characterFormat": {
                                "fontSize": null
                            },
                            "fieldType": 1
                        },
                        {
                            "characterFormat": {
                                "fontSize": null,
                                "fontColor": "empty"
                            },
                            "text": "/"
                        },
                        {
                            "characterFormat": {
                                "fontSize": null,
                                "fontColor": "empty"
                            },
                            "text": "a"
                        }
                    ]
                }
            ],
            "headersFooters": {
                "header": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
                            },
                            "inlines": []
                        }
                    ]
                },
                "footer": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
                            },
                            "inlines": []
                        }
                    ]
                },
                "evenHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
                            },
                            "inlines": []
                        }
                    ]
                },
                "evenFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
                            },
                            "inlines": []
                        }
                    ]
                },
                "firstPageHeader": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
                            },
                            "inlines": []
                        }
                    ]
                },
                "firstPageFooter": {
                    "blocks": [
                        {
                            "paragraphFormat": {
                                "listFormat": {}
                            },
                            "characterFormat": {
                                "fontSize": null
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
        "lineSpacing": 1.0791666507720947,
        "lineSpacingType": "Multiple",
        "listFormat": {},
        "bidi": false
    },
    "defaultTabWidth": 36,
    "trackChanges": false,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": true,
    "protectionType": "NoProtection",
    "dontUseHTMLParagraphAutoSpacing": false,
    "formFieldShading": true,
    "styles": [
        {
            "name": "Normal",
            "type": "Paragraph",
            "paragraphFormat": {
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": null,
                "fontColor": "empty"
            },
            "next": "Normal"
        },
        {
            "name": "Default Paragraph Font",
            "type": "Character",
            "characterFormat": {
                "fontSize": null,
                "fontColor": "empty"
            }
        },
        {
            "name": "Normal (Web)",
            "type": "Paragraph",
            "paragraphFormat": {
                "beforeSpacing": 5,
                "afterSpacing": 5,
                "lineSpacing": 1,
                "lineSpacingType": "Multiple",
                "listFormat": {}
            },
            "characterFormat": {
                "fontSize": 12,
                "fontFamily": "Times New Roman",
                "fontColor": "empty",
                "fontSizeBidi": 12,
                "fontFamilyBidi": "Times New Roman"
            },
            "basedOn": "Normal",
            "next": "Normal (Web)"
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
                "fontSize": null,
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
                "fontSize": null,
                "fontColor": "empty"
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
                "fontSize": null,
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
                "fontSize": null,
                "fontColor": "empty"
            },
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
                "fontColor": "#2F5496",
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
                "fontColor": "#2F5496",
                "fontSizeBidi": 16,
                "fontFamilyBidi": "Calibri Light"
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
                "fontSize": null,
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
                "fontSize": null,
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
                "fontSize": null,
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
                "fontSize": null,
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
                "fontSize": null,
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
                "fontSize": null,
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
                    "afterSpacing": 0,
                    "lineSpacing": 1,
                    "lineSpacingType": "Multiple",
                    "styleName": "Normal",
                    "listFormat": {}
                },
                "characterFormat": {
                    "fontSize": null,
                    "fontColor": "empty"
                },
                "inlines": [
                    {
                        "characterFormat": {
                            "fontSize": null,
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
                    "fontSize": null,
                    "fontColor": "empty"
                },
                "inlines": [
                    {
                        "characterFormat": {
                            "fontSize": null,
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
                "characterFormat": {
                    "fontSize": null
                },
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
                    "fontSize": null,
                    "fontColor": "empty"
                },
                "inlines": [
                    {
                        "characterFormat": {
                            "fontSize": null,
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
                    "fontSize": null,
                    "fontColor": "empty"
                },
                "inlines": [
                    {
                        "characterFormat": {
                            "fontSize": null,
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
                "characterFormat": {
                    "fontSize": null
                },
                "inlines": []
            }
        ]
    }
  };
  describe('import textbox shape with image positioning', () => {
    let editor: DocumentEditor;
    let documentHelper :DocumentHelper;
    let sections: BodyWidget[];
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({});
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        sections = editor.parser.convertJsonToDocument(JSON.stringify(shapeWithImagePos));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper= undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    
    it('Image zorder position validation', () => {
        expect((sections[0] as any).childWidgets[0].childWidgets[0].children[14].zOrderPosition).toBe(251681792);
    });
});