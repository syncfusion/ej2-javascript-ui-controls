import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer, DocumentHelper } from '../../../src/document-editor/implementation/viewer/viewer';;
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { TextElementBox, BodyWidget, ParagraphWidget, LineWidget, EditRangeStartElementBox, EditRangeEndElementBox, FieldElementBox, TextFormField, CheckBoxFormField, DropDownFormField } from '../../../src/document-editor/implementation/viewer/page';


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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('section format Bidi validation', () => {
        expect((sections[0] as any).sectionFormat.bidi).toBe(true);
    });
    it('character format Bidi validation', () => {
        expect((sections[0] as any).childWidgets[0].characterFormat.bidi).toBe(true);
    });
    it('character format Bdo validation', () => {
        expect((sections[0] as any).childWidgets[1].childWidgets[0].children[0].characterFormat.bdo).toBe('RTL');
    });
    it('Paragraph format Bidi validation', () => {
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table format Bidi validation', () => {
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Page break inside table open validation', () => {
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('check default tab width', () => {
        editor.open(JSON.stringify(tab));
        expect(editor.documentHelper.defaultTabWidth).toBe(56);
    });
    it('open blank default tab width', () => {
        editor.openBlank();
        expect(editor.documentHelper.defaultTabWidth).toBe(36);
    });
    it('open chart', () => {
        editor.open(JSON.stringify(chart));
    });
    it('open Line chart', () => {
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Formatting restriction validation', () => {
        expect(editor.documentHelper.restrictFormatting).toBe(true);
        expect(editor.documentHelper.isDocumentProtected).toBe(true);
    });
    it(' without Formatting restriction validation', () => {
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
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Edit readonly with everyone validation', () => {
        expect(editor.documentHelper.protectionType).toBe('ReadOnly');
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[2] as ParagraphWidget).childWidgets[0] as LineWidget;
        expect(lineWidget.children.length).toBe(3);
        expect((lineWidget.children[0] as EditRangeStartElementBox).group).toBe('Everyone');
    });
    it('Edit readonly with single user validation validation', () => {
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Field character validation', () => {
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
        //if already style is there in collection with same name it should not be added.
        let json = {"name":"onSuccess","data":{"sections":[{"blocks":[{"characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left","styleName":"Heading 1","bidi":false,"contextualSpacing":false},"inlines":[{"text":"Syncfusion","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}]}],"headersFooters":{},"sectionFormat":{"headerDistance":36,"footerDistance":36,"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0}}],"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":11,"fontFamily":"Calibri","fontColor":"#00000000","bidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left"}},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Heading 1","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"beforeSpacing":12,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","textAlignment":"Left"}},{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"bold":false,"italic":false,"strikethrough":"None","fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496FF","bidi":false,"fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"}}],"defaultTabWidth":36,"formatting":false,"protectionType":"NoProtection","enforcement":false},"readyState":4,"status":200};
        editor.openBlank();
        editor.editor.pasteFormattedContent(json);
        expect(editor.documentHelper.styles.length).toBe(14);
    });
    it('Custom style paste validation', () => {
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
        setTimeout(function () {
            done();
        }, 500);
    });
    it('Text formfield validation', () => {
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
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fieldElement: FieldElementBox = lineWidget.children[2] as FieldElementBox;
        let formFieldData: TextFormField = new TextFormField();
        fieldElement.formFieldData = formFieldData;
        expect((fieldElement.formFieldData as CheckBoxFormField).size).toBe(undefined);
       // expect((fieldElement.formFieldData as CheckBoxFormField).defaultValue).toBe('');
    });
    it('Dropdown formfield validation', () => {
        let lineWidget: LineWidget = (editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
        let fieldElement: FieldElementBox = lineWidget.children[0] as FieldElementBox;
        let formFieldData: TextFormField = new TextFormField();
        fieldElement.formFieldData = formFieldData;
        expect((fieldElement.formFieldData as DropDownFormField).selectedIndex).toBe(undefined);
        expect((fieldElement.formFieldData as DropDownFormField).dropdownItems).toString;
    });
});