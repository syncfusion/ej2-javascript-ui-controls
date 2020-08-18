import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, TablePropertiesDialog, DocumentHelper, 
FieldElementBox, TextElementBox, SfdtExport, BookmarkElementBox, ParagraphWidget, LineWidget } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
let testCase: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": false }, "text": "Test" }] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": true, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": true, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }], "grid": [234, 234], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": false } }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }, { "rows": [{ "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "bookmark" }] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": true, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }, { "cells": [{ "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 0 }, { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }], "cellFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "preferredWidth": 234, "preferredWidthType": "Point", "cellWidth": 234, "columnSpan": 1, "rowSpan": 1, "verticalAlignment": "Top" }, "columnIndex": 1 }], "rowFormat": { "height": 0, "allowBreakAcrossPages": true, "heightType": "Auto", "isHeader": false, "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 } }, "gridBefore": 0, "gridBeforeWidth": 0, "gridBeforeWidthType": "Point", "gridAfter": 0, "gridAfterWidth": 0, "gridAfterWidthType": "Point", "leftIndent": 0 } }], "grid": [234, 234], "tableFormat": { "borders": { "top": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "left": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "right": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "bottom": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "diagonalDown": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "diagonalUp": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "None", "lineWidth": 0, "shadow": false, "space": 0 }, "horizontal": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 }, "vertical": { "color": "#000000", "hasNoneStyle": false, "lineStyle": "Single", "lineWidth": 0.5, "shadow": false, "space": 0 } }, "shading": { "backgroundColor": "#ffffff", "foregroundColor": "empty", "textureStyle": "TextureNone" }, "cellSpacing": 0, "leftIndent": 0, "tableAlignment": "Left", "topMargin": 0, "rightMargin": 5.4, "leftMargin": 5.4, "bottomMargin": 0, "preferredWidth": 0, "preferredWidthType": "Auto", "bidi": false, "allowAutoFit": false } }, { "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": false }, "text": "TestBookmark" }, { "characterFormat": {}, "bookmarkType": 1, "name": "bookmark" }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Selection bookmark property validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Single line in a paragraph with selection 1', () => {
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.getBookmarks()[0]).toBe('b1');
    });
    it('Multiple lines in a paragraph with selection', () => {
        editor.openBlank();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.selection.handleShiftUpKey();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.getBookmarks()[0]).toBe('b1');
    });
    it('Multiple lines in different paragraph with selection', () => {
        editor.openBlank();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large');
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.selection.handleShiftUpKey();
        editor.editor.insertBookmark('b1');
        expect(editor.selection.getBookmarks()[0]).toBe('b1');
    });
    it('Inside table cell with selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        (editor.selection as any).selectNextCell();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Happy World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b2');
        editor.selection.handleShiftLeftKey();
        editor.selection.selectAll()
        expect(editor.selection.getBookmarks().length).toBe(2);
    });
    it('Single line in a paragraph without selection', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        expect(editor.selection.getBookmarks()[0]).toBe('b1');
    });
    it('Empty bookmark on single line in a paragraph without selection', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.getBookmarks().length).toBe(0);
    });
    it('single line in a paragraph with selection 2', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.selectAll();
        editor.editor.insertBookmark('b1');
        editor.selection.handleLeftKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.getBookmarks().length).toBe(1);
    });
    it('combination paragraph and table contains bookmark validation ', () => {
        editor.openBlank();
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b1');
        editor.selection.handleRightKey();
        editor.editor.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.editor.insertText('Hello World');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        editor.editor.insertBookmark('b2');
        editor.selection.selectAll();
        expect(editor.selection.getBookmarks().length).toBe(2);
    });
    it('insert text after bookmark insert validation', () => {
        editor.openBlank();
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.insertBookmark('b1');
        editor.selection.handleRightKey();
        editor.selection.handleLeftKey();
        editor.selection.handleRightKey();
        editor.editor.insertText('s');
        expect(editor.selection.start.currentWidget.children.length).toBe(4);
    });

    it('Bookmark validation in nested table', () => {
        editor.open(JSON.stringify(testCase));
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.getBookmarks().length).toBe(0);
    });
});

describe('enable repeat row header test', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('enable repeat row header scenario 1', () => {
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 2', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
    it('enable repeat row header scenario 3', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 4', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
});

describe('Selection public API validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('selects current line', () => {
        editor.editor.insertText('Hello World');
        editor.selection.selectLine();
        expect(editor.selection.start.hierarchicalPosition).not.toBe(editor.selection.end.hierarchicalPosition);
    });
    it('selects current paragraph', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American,');
        editor.selection.moveUp();
        editor.selection.selectParagraph();
        expect(editor.selection.start.currentWidget).not.toBe(editor.selection.end.currentWidget);
    });
    it('select current word by excluding space', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.text).toBe('world');
    });
    it('select current word by including space', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord(true);
        expect(editor.selection.text).toBe('world ');
    });
    it('moves selection to document start', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.moveToDocumentStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;0;0;0');
    });
    it('moves selection to document end', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello world ');
        editor.selection.moveToDocumentEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;4;0;12');
    });
    it('moves selection to paragraph start', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Adventure Works Cycles, the fictitious company on which the AdventureWorks sample databases are based, is a large, multinational manufacturing company. The company manufactures and sells metal and composite bicycles to North American,');
        editor.selection.moveToParagraphStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;0;0');
    });
    it('moves selection to paragraph end', () => {
        editor.selection.moveToParagraphEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;38');
    });
    it('moves selection to previous line', () => {
        editor.selection.moveToPreviousLine();
        //expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;1;39');
    });
    it('moves selection to next line', () => {
        editor.selection.moveToNextLine();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;37');
    });
    it('moves selection to line start', () => {
        editor.selection.moveToLineStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;0');
    });
    it('moves selection to line end', () => {
        editor.selection.moveToLineEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;37');
    });
    it('moves selection to previous character', () => {
        let endOffset = editor.selection.end.offset;
        editor.selection.moveToPreviousCharacter();
        expect(editor.selection.end.offset).toBeLessThan(endOffset);
    });
    it('moves selection to next character', () => {
        let endOffset = editor.selection.end.offset;
        editor.selection.moveToNextCharacter();
        expect(editor.selection.end.offset).toBe(endOffset + 1);
    });
    it('extends selection to line start', () => {
        editor.selection.extendToLineStart();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to line end', () => {
        editor.selection.extendToLineEnd();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to line end', () => {
        editor.selection.extendToLineEnd();
        expect(editor.selection.start.offset).not.toBe(editor.selection.end.offset);
    });
    it('extends selection to previous line', () => {
        editor.selection.extendToPreviousLine();
        expect(editor.selection.start.currentWidget).not.toBe(editor.selection.end.currentWidget);
    });
    it('extends selection to next line', () => {
        editor.selection.extendToNextLine();
        expect(editor.selection.start.currentWidget).toBe(editor.selection.end.currentWidget);
    });
    it('extends selection to paragraph start', () => {
        editor.selection.extendToParagraphStart();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;0;0');
    });
    it('extends selection to paragraph end', () => {
        editor.selection.extendToParagraphEnd();
        expect(editor.selection.end.hierarchicalPosition).toBe('0;0;5;2;38');
    });
    it('extends selection backward', () => {
        editor.selection.moveToLineEnd();
        let endOffset: number = editor.selection.end.offset;
        editor.selection.extendBackward();
        expect(editor.selection.end.offset).toBe(endOffset - 1);
    });
    it('extends selection forward', () => {
        editor.selection.moveToLineStart();
        let endOffset: number = editor.selection.start.offset;
        editor.selection.extendForward();
        expect(editor.selection.end.offset).toBe(endOffset + 1);
    });
    it('extends selection to word start', () => {
        editor.openBlank();
        editor.editor.insertText('Hello world');
        editor.selection.extendToWordStart();
        expect(editor.selection.text).toBe('world');
    });
    it('extends selection to word start', () => {
        editor.selection.extendToWordEnd();
        expect(editor.selection.text).toBe('');
    });
    it('start offset property', () => {
        expect(editor.selection.startOffset).toBe('0;0;11');
    });
    it('end offset property', () => {
        expect(editor.selection.endOffset).toBe('0;0;11');
    });
    it('select using hierarchical index', () => {
        editor.openBlank();
        editor.editor.insertText('Hello world');
        editor.selection.select('0;0;0', '0;0;11');
        expect(editor.selection.text).toBe('Hello world');
    });
});
describe('Selection extension in backward selection', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('handle shift up key validation', () => {
        editor.editor.insertText('Hello World');
        editor.editor.onEnter();
        editor.editor.insertText('Hello World');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.start.offset).toBe(12);
    });
    it('apply highlight color on backward selection', () => {
        editor.selection.selectAll();
        editor.editor.applyNumbering('%1.');
        editor.selection.handleDownKey();
        editor.selection.handleShiftEndKey();
        editor.selection.characterFormat.highlightColor = 'Yellow';
        expect(editor.selection.start.paragraph.characterFormat.highlightColor).toBe('NoColor');
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('apply highlight color for multiple paragraph', () => {
        editor.editor.onEnter();
        editor.editor.insertText('Hello World');
        editor.selection.handleUpKey();
        editor.selection.handleShiftDownKey();
        editor.selection.characterFormat.highlightColor = 'Yellow';
        editor.selection.handleLeftKey();
        expect(editor.selection.start.paragraph.characterFormat.highlightColor).toBe('NoColor');
        editor.selection.handleDownKey();
        expect(editor.selection.characterFormat.highlightColor).toBe('Yellow');
    })
});
let refField: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "bookmarkType": 0, "name": "Table" }, { "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true }, { "characterFormat": {}, "text": " REF check \\h " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": "evidence" }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }, { "characterFormat": {}, "text": " is a written, drawn, presented, or memorialized representation of thought. The word originates " }, { "characterFormat": {}, "text": "from the Latin documen" }, { "characterFormat": {}, "text": "t" }, { "characterFormat": {}, "text": ", which denotes a \"teaching\" or \"lesson\": the verb " }, { "characterFormat": {}, "text": "doceō" }, { "characterFormat": {}, "text": " denotes \"to teach\". In " }, { "characterFormat": {}, "text": "the past, the word was usually used to denote a written proof useful as " }, { "characterFormat": {}, "bookmarkType": 0, "name": "check" }, { "characterFormat": {}, "text": "evidence" }, { "characterFormat": {}, "bookmarkType": 1, "name": "check" }, { "characterFormat": {}, "text": " of a truth or fact." }, { "characterFormat": {}, "bookmarkType": 1, "name": "Table" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 5, "afterSpacing": 5, "lineSpacing": 1, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 24, "fontFamily": "Times New Roman", "boldBidi": true, "fontSizeBidi": 24, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Heading 1" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "bold": true, "fontSize": 24, "fontFamily": "Times New Roman", "boldBidi": true, "fontSizeBidi": 24, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 5, "afterSpacing": 5, "lineSpacing": 1, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "bold": true, "fontSize": 18, "fontFamily": "Times New Roman", "boldBidi": true, "fontSizeBidi": 18, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Heading 2" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "bold": true, "fontSize": 18, "fontFamily": "Times New Roman", "boldBidi": true, "fontSizeBidi": 18, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Default Paragraph Font" }, { "name": "Normal (Web)", "type": "Paragraph", "paragraphFormat": { "beforeSpacing": 5, "afterSpacing": 5, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Times New Roman", "fontSizeBidi": 12, "fontFamilyBidi": "Times New Roman" }, "basedOn": "Normal", "next": "Normal (Web)" }, { "name": "Caption", "type": "Paragraph", "paragraphFormat": { "afterSpacing": 10, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {} }, "characterFormat": { "italic": true, "fontSize": 9, "fontColor": "#44546AFF", "italicBidi": true, "fontSizeBidi": 9 }, "basedOn": "Normal", "next": "Normal" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [] };
describe('Update Reference field', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(refField));
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('update Reference field', () => {
        let refText: string;
        let text: string;
        for (let i: number = 0; i < editor.documentHelper.fields.length; i++) {
            let field: FieldElementBox = editor.documentHelper.fields[i];
            let fieldCode: string = editor.documentHelper.selection.getFieldCode(field);
            fieldCode = fieldCode.trim();
            if (fieldCode.toLowerCase().indexOf('ref') === 0) {
                editor.documentHelper.selection.updateRefField(field);
                refText = (field.fieldSeparator.nextNode as TextElementBox).text;
            }
            let bookmark: BookmarkElementBox = editor.documentHelper.bookmarks.get('check');
            text = (bookmark.nextNode as TextElementBox).text;
        }
        expect(refText).toBe(text);
    });
    it('update Reference field after updation', () => {
        let referenceText: string;
        for (let i: number = 0; i < editor.documentHelper.fields.length; i++) {
            let field: FieldElementBox = editor.documentHelper.fields[i];
            let fieldCode: string = editor.documentHelper.selection.getFieldCode(field);
            fieldCode = fieldCode.trim();
            if (fieldCode.toLowerCase().indexOf('ref') === 0) {
                let bookmark: BookmarkElementBox = editor.documentHelper.bookmarks.get('check');
                (bookmark.nextNode as TextElementBox).text = 'checked';
                editor.documentHelper.selection.updateRefField(field);
                referenceText = (field.fieldSeparator.nextNode as TextElementBox).text;
            }
        }
        expect(referenceText).toBe('checked');
    });
});



/**
 * Selection validation with bookmark and line break character
 */
let loadData:any={
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
                            "bookmarkType": 0,
                            "name": "d"
                        },
                        {
                            "characterFormat": {
                                "bidi": false
                            },
                            "text": "sdsadad"
                        },
                        {
                            "characterFormat": {
                                "bold": false,
                                "italic": false,
                                "underline": "None",
                                "bidi": false
                            },
                            "text": "\u000b"
                        },
                        {
                            "characterFormat": {},
                            "bookmarkType": 1,
                            "name": "d"
                        }
                    ]
                }
            ],
            "headersFooters":{}
        }
    ],
    "defaultTabWidth": 36,
    "enforcement": false,
    "hashValue": "",
    "saltValue": "",
    "formatting": false,
    "protectionType": "NoProtection",
    "dontUseHTMLParagraphAutoSpacing": false,
    "styles": [],
    "lists": [],
    "abstractLists": [],
    "comments": []
};
describe('shift down key validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('with bookmark and line break character', () => {
        editor.open(JSON.stringify(loadData));
        editor.selection.handleShiftDownKey();
        expect(editor.selection.start.currentWidget).not.toBe(editor.selection.end.currentWidget);
    });
});

/**
 * Hidden bookmark API validation
 */
let bookmarkData:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Toc1","listFormat":{},"tabs":[{"position":468,"deletePosition":0,"tabJustification":"Right","tabLeader":"Dot"}]},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":"TOC \\o \"1-3\" \\h \\z"},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":" HYPERLINK \\l \"_Toc000000001\" "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"Heading 1"},{"characterFormat":{},"text":"\t"},{"characterFormat":{},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{},"text":" PAGEREF_Toc000000001 \\h "},{"characterFormat":{},"fieldType":2},{"characterFormat":{},"text":"1"},{"characterFormat":{},"fieldType":1},{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"fieldType":1}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"paragraphFormat":{"styleName":"Heading 1","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_Toc000000001"},{"characterFormat":{},"text":"Heading 1"},{"characterFormat":{},"bookmarkType":1,"name":"_Toc000000001"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Toc1","type":"Paragraph","paragraphFormat":{"afterSpacing":5,"listFormat":{}},"characterFormat":{},"basedOn":"Normal","next":"Normal"}],"lists":[],"abstractLists":[],"comments":[]};
describe('Hidden Bookmark API', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(bookmarkData));
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('include hidden bookmark validation', () => {
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleRightKey()
        editor.selection.handleRightKey()
        expect(editor.selection.getBookmarks().length).toBe(0);
        expect(editor.selection.getBookmarks(true).length).toBe(1)
    });
    it('Insert text before merge field', () => {
        editor.openBlank();
        editor.editor.insertField('Merge', 'check');
        editor.selection.handleHomeKey();
        editor.editor.insertText('Hello');
        let text : string = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text;
        expect(text).toBe('Hello');
    });
    it('select comment word Control right shift key', () => {
        editor.openBlank();
        editor.editorModule.insertText('hello syncfusion world');
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlShiftRightKey();
        editor.editorModule.insertComment('syncfusion');
        editor.selection.handleHomeKey();
        editor.selection.handleControlShiftRightKey();
        editor.selection.handleControlShiftRightKey();
        editor.selection.handleControlShiftRightKey();
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('select comment word Control left shift key ', () => {
        editor.openBlank();
        editor.editorModule.insertText('hello syncfusion world');
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlShiftRightKey();
        editor.editorModule.insertComment('syncfusion');
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlShiftLeftKey();
        editor.selection.handleControlShiftLeftKey();
        editor.selection.handleControlShiftLeftKey();
        expect(editor.selection.isEmpty).toBe(false)
    });
    it('select single word comment word Control right shift key', () => {
        editor.openBlank();
        editor.editorModule.insertText('hello');
        editor.selection.selectAll();
        editor.editorModule.insertComment('syncfusion');
        editor.selection.handleHomeKey();
        editor.selection.handleControlShiftRightKey();
        expect(editor.selection.isEmpty).toBe(false);
    });
});



describe('Bookmark navigate API', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('insert bookmark validation', () => {
        editor.editor.insertText('sample');
        editor.selection.selectAll();
        editor.editor.insertBookmark('sample');
        expect(editor.selection.start.currentWidget.children.length).toBe(3);
    });
    it('Navigate bookmark and delete validation', () => {
        editor.selection.selectBookmark('sample');
        editor.editor.delete();
        expect(editor.selection.start.currentWidget.children.length).toBe(0);
    });
    it('Navigate dropdown formfield validation', () => {
        editor.openBlank();
        editor.editor.insertFormField('DropDown');    
        let keyEvent: any = {
            keyCode: 37,
            preventDefault: () => { return true; }
        }
        editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false); 
        expect(() => {  editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false); }).not.toThrowError();
        keyEvent.keyCode = 39;
        expect(() => {  editor.selectionModule.onKeyDownInternal(keyEvent, false, false, false); }).not.toThrowError();
    });
    it('Get previous context item validation', () => {
        editor.openBlank();
        editor.editor.insertText('check ');
        editor.editor.insertBookmark('goto');
        editor.editor.insertText('new');
        let contextItem: string  = editor.selection.getPreviousContextType();
        expect(contextItem).toBe('Text');
        editor.selection.handleControlLeftKey();
        editor.selection.handleRightKey();
        contextItem = editor.selection.getPreviousContextType();
        expect(contextItem).toBe('Bookmark');        
    });
    it('Get next context item validation', () => {
        editor.openBlank();
        editor.editor.insertText('check ');
        editor.editor.insertBookmark('goto');
        editor.editor.insertText('new');
        editor.selection.handleHomeKey();
        let contextItem: string  = editor.selection.getNextContextType();
        expect(contextItem).toBe('Text');
        editor.selection.handleControlRightKey();
        editor.selection.handleLeftKey();
        contextItem = editor.selection.getNextContextType();
        expect(contextItem).toBe('Bookmark');        
    });
});