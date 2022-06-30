import { Toolbar } from "../../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../../test-helper.spec";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { Editor } from "../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
import { HeaderFooterWidget, LineWidget, ParagraphWidget, TableWidget } from "../../../src/document-editor/implementation/viewer/page";
let text = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"with descriptions of people who lived in the past or events that happened in "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"the past."},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Such Historical figures and events include King Leopold II of ","revisionIds":["d4e8a984-a9e8-4516-81c5-4c5b6bbe29ff"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Belgium and The Scramble of Africa in the late 19th century. Among other ","revisionIds":["d4e8a984-a9e8-4516-81c5-4c5b6bbe29ff"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"things","revisionIds":["d4e8a984-a9e8-4516-81c5-4c5b6bbe29ff"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":", King Leopold II of Belgium (1835-1909), is known for the exploitation "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"of Congo and the mass murder of its citizens as told in King "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Leopold?s"},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Ghost "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"by "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Adam"},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Such","revisionIds":["27c88fb1-5bad-48a7-bbee-0ee090b5b809"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Historical figures and events include King Leopold II of Belgium ","revisionIds":["27c88fb1-5bad-48a7-bbee-0ee090b5b809"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"and The Scramble of Africa in the late 19th century. Among other things","revisionIds":["27c88fb1-5bad-48a7-bbee-0ee090b5b809"]}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Revision","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"listFormat":{}},"characterFormat":{},"next":"Revision"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Vijay Bhupathi Veluswami","date":"2020-06-25T20:31:00Z","revisionType":"MoveFrom","revisionId":"d4e8a984-a9e8-4516-81c5-4c5b6bbe29ff"},{"author":"Vijay Bhupathi Veluswami","date":"2020-06-25T20:31:00Z","revisionType":"MoveTo","revisionId":"27c88fb1-5bad-48a7-bbee-0ee090b5b809"}]}'
let sentence = '{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"with descriptions of people who lived in the past or events that happened in "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"the past."},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Such Historical figures and events include King Leopold II of ","revisionIds":["85055eac-ef30-4c8a-8eef-be9fba1a79d6"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Belgium and The Scramble of Africa in the late 19th century. Among other ","revisionIds":["85055eac-ef30-4c8a-8eef-be9fba1a79d6"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"things","revisionIds":["85055eac-ef30-4c8a-8eef-be9fba1a79d6"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":", King Leopold II of Belgium (1835-1909), is known for the exploitation "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"of Congo and the mass murder of "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"i","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"t","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"s","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":" ","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"c","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"i","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"t","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"i","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"z","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"e","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"n","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","bidi":false,"fontSizeBidi":15},"text":"s","revisionIds":["0ryo22wppiwwgqndb0ihsm"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" as told in King "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Leopold?s"},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Ghost "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"by "},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Adam"},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"Such","revisionIds":["10fb3cfd-8765-4ccc-841a-3e75b442faad"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":" Historical figures and events include King Leopold II of Belgium ","revisionIds":["10fb3cfd-8765-4ccc-841a-3e75b442faad"]},{"characterFormat":{"fontSize":15,"fontColor":"#435059FF","fontSizeBidi":15},"text":"and The Scramble of Africa in the late 19th century. Among other things","revisionIds":["10fb3cfd-8765-4ccc-841a-3e75b442faad"]}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{"bidi":false},"text":"The great king.","revisionIds":["zo175xhdoa92o4u92vx2bk"]}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Revision","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"listFormat":{}},"characterFormat":{},"next":"Revision"},{"name":"Balloon Text","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"listFormat":{}},"characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Normal","link":"Balloon Text Char","next":"Balloon Text"},{"name":"Balloon Text Char","type":"Character","characterFormat":{"fontSize":9,"fontFamily":"Segoe UI","fontSizeBidi":9,"fontFamilyBidi":"Segoe UI"},"basedOn":"Default Paragraph Font"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Vijay Bhupathi Veluswami","date":"2020-06-25T20:31:00Z","revisionType":"MoveFrom","revisionId":"85055eac-ef30-4c8a-8eef-be9fba1a79d6"},{"author":"Vijay Bhupathi Veluswami","date":"2020-06-25T20:31:00Z","revisionType":"MoveTo","revisionId":"10fb3cfd-8765-4ccc-841a-3e75b442faad"},{"author":"Guest user","date":"2020-07-07T10:33:05.301Z","revisionType":"Insertion","revisionId":"zo175xhdoa92o4u92vx2bk"},{"author":"Guest user","date":"2020-07-07T10:33:17.839Z","revisionType":"Deletion","revisionId":"0ryo22wppiwwgqndb0ihsm"}]}'
let table ='{"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":3}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0,"revisionIds":["tnrc5f7ni6fe1iep0nn6wr"]}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":3}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0,"revisionIds":["7jul9v4nxp736bpd2ir51e"]}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":3}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"cellWidth":117,"columnSpan":1,"rowSpan":1},"columnIndex":3}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0,"revisionIds":["efcrkt0cykfjm6tcvvc3d"]}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":2},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":117,"preferredWidthType":"Point","cellWidth":117,"columnSpan":1,"rowSpan":1,"verticalAlignment":"Top"},"columnIndex":3}],"rowFormat":{"height":0,"allowBreakAcrossPages":true,"heightType":"Auto","isHeader":false,"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridBeforeWidth":0,"gridBeforeWidthType":"Point","gridAfter":0,"gridAfterWidth":0,"gridAfterWidthType":"Point","leftIndent":0,"revisionIds":["b7o1za6sqh9793m91llkb5"]}}],"grid":[117,117,117,117],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":4},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]},{"rows":[{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0,"revisionIds":["ziqyn0qwi3vzgb2y2s5jh"]}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0,"revisionIds":["w82kpe7gve4fz5v22lkm6"]}},{"cells":[{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":0},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":1},{"blocks":[{"paragraphFormat":{"leftIndent":0,"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"cellFormat":{"borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"shading":{},"preferredWidth":156,"cellWidth":156,"columnSpan":1,"rowSpan":1},"columnIndex":2}],"rowFormat":{"height":0,"heightType":"Auto","borders":{"top":{},"left":{},"right":{},"bottom":{},"diagonalDown":{},"diagonalUp":{},"horizontal":{},"vertical":{}},"gridBefore":0,"gridAfter":0,"revisionIds":["95idlnhk3eq0rvz1aovm88"]}}],"grid":[156,156,156],"tableFormat":{"borders":{"top":{"lineStyle":"Single","lineWidth":0.5},"left":{"lineStyle":"Single","lineWidth":0.5},"right":{"lineStyle":"Single","lineWidth":0.5},"bottom":{"lineStyle":"Single","lineWidth":0.5},"diagonalDown":{},"diagonalUp":{},"horizontal":{"lineStyle":"Single","lineWidth":0.5},"vertical":{"lineStyle":"Single","lineWidth":0.5}},"shading":{},"leftIndent":0,"topMargin":0,"rightMargin":5.4,"leftMargin":5.4,"bottomMargin":0,"preferredWidthType":"Auto"},"columnCount":3},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{},"evenFooter":{},"firstPageHeader":{},"firstPageFooter":{}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":true,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Guest user","date":"2022-05-18T16:34:37.473Z","revisionType":"Deletion","revisionId":"tnrc5f7ni6fe1iep0nn6wr"},{"author":"Guest user","date":"2022-05-18T16:34:37.488Z","revisionType":"Deletion","revisionId":"7jul9v4nxp736bpd2ir51e"},{"author":"Guest user","date":"2022-05-18T16:34:42.827Z","revisionType":"Insertion","revisionId":"efcrkt0cykfjm6tcvvc3d"},{"author":"Guest user","date":"2022-05-18T16:34:42.828Z","revisionType":"Insertion","revisionId":"b7o1za6sqh9793m91llkb5"},{"author":"Guest user","date":"2022-05-18T16:35:05.697Z","revisionType":"Insertion","revisionId":"ziqyn0qwi3vzgb2y2s5jh"},{"author":"Guest user","date":"2022-05-18T16:35:05.700Z","revisionType":"Insertion","revisionId":"w82kpe7gve4fz5v22lkm6"},{"author":"Guest user","date":"2022-05-18T16:35:05.701Z","revisionType":"Insertion","revisionId":"95idlnhk3eq0rvz1aovm88"}],"customXml":[]}'
let tableGroup ='{"sections":[{"blocks":[{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["346219d4-0ca5-4e07-b355-8350e8ddb936"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["346219d4-0ca5-4e07-b355-8350e8ddb936"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["346219d4-0ca5-4e07-b355-8350e8ddb936"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["f7d2a3dd-276f-454e-a804-23be10dad9af"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["f7d2a3dd-276f-454e-a804-23be10dad9af"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["f7d2a3dd-276f-454e-a804-23be10dad9af"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"DELETED","revisionIds":["8f193753-3819-4eb5-b60f-789b164678a5"]}]},{"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["0e421e9a-dd66-4ddc-89ad-f6549f6df3ab"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["0e421e9a-dd66-4ddc-89ad-f6549f6df3ab"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.80000305175781,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.80000305175781}},{"blocks":[{"characterFormat":{"revisionIds":["0e421e9a-dd66-4ddc-89ad-f6549f6df3ab"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}},{"blocks":[{"characterFormat":{"revisionIds":["0e421e9a-dd66-4ddc-89ad-f6549f6df3ab"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["f52a1eb6-f581-432f-ae62-6f4cf6ac4d80"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["f52a1eb6-f581-432f-ae62-6f4cf6ac4d80"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.80000305175781,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.80000305175781}},{"blocks":[{"characterFormat":{"revisionIds":["f52a1eb6-f581-432f-ae62-6f4cf6ac4d80"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}},{"blocks":[{"characterFormat":{"revisionIds":["f52a1eb6-f581-432f-ae62-6f4cf6ac4d80"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"DELETED AND INSERTED","revisionIds":["596b25e7-24e8-4f9a-9267-9daa2114acb9"]}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["b3b82750-1c5c-4fc3-b767-ce4ab3030ef8"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["b3b82750-1c5c-4fc3-b767-ce4ab3030ef8"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["2583be89-ce5c-4da7-a777-977f7f14febb"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["2583be89-ce5c-4da7-a777-977f7f14febb"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["26379fb6-f47d-4e94-8a86-76e5b2a6fd8d"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["26379fb6-f47d-4e94-8a86-76e5b2a6fd8d"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["02bc615b-af9e-4cb4-8f2e-80077136440c"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["02bc615b-af9e-4cb4-8f2e-80077136440c"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["173c4d9c-6bde-4c57-88d0-d141da01ec48"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["173c4d9c-6bde-4c57-88d0-d141da01ec48"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["e5d13b14-693e-49b9-95d5-f1ca82c54435"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["e5d13b14-693e-49b9-95d5-f1ca82c54435"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"MULTIPLE TABLES","revisionIds":["092287c0-213f-4524-9f13-7ceae6cbe912"]}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["aa92a419-bb06-45a8-b64d-4123732883f8"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["aa92a419-bb06-45a8-b64d-4123732883f8"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["aa92a419-bb06-45a8-b64d-4123732883f8"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["db8fc782-ef0b-429c-8893-3f4a902f2650"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["db8fc782-ef0b-429c-8893-3f4a902f2650"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["db8fc782-ef0b-429c-8893-3f4a902f2650"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["14aa004c-bd73-4816-ab39-bdedc27a5b08"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["14aa004c-bd73-4816-ab39-bdedc27a5b08"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.80000305175781,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.80000305175781}},{"blocks":[{"characterFormat":{"revisionIds":["14aa004c-bd73-4816-ab39-bdedc27a5b08"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}},{"blocks":[{"characterFormat":{"revisionIds":["14aa004c-bd73-4816-ab39-bdedc27a5b08"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["5a9d6596-6964-42e1-b662-3934d26d3d8a"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["5a9d6596-6964-42e1-b662-3934d26d3d8a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.80000305175781,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.80000305175781}},{"blocks":[{"characterFormat":{"revisionIds":["5a9d6596-6964-42e1-b662-3934d26d3d8a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}},{"blocks":[{"characterFormat":{"revisionIds":["5a9d6596-6964-42e1-b662-3934d26d3d8a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["cf321c1f-e691-4fcf-b46a-78a2dafe0a5f"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["cf321c1f-e691-4fcf-b46a-78a2dafe0a5f"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.80000305175781,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.80000305175781}},{"blocks":[{"characterFormat":{"revisionIds":["cf321c1f-e691-4fcf-b46a-78a2dafe0a5f"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}},{"blocks":[{"characterFormat":{"revisionIds":["cf321c1f-e691-4fcf-b46a-78a2dafe0a5f"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":155.85000610351562,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":155.85000610351562}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"IN-DEL-IN-DEL","revisionIds":["7dedb6bf-9aea-43d5-b1cf-8302987e6fd8"]}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["73a988a5-9490-4985-8965-03786d04a100"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["73a988a5-9490-4985-8965-03786d04a100"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["67463305-df3c-4aec-9a93-4e24e225e750"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["67463305-df3c-4aec-9a93-4e24e225e750"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["cf8fec77-25b4-46ae-ab9b-26f94eadbd41"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["cf8fec77-25b4-46ae-ab9b-26f94eadbd41"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["4524e227-595e-4066-a3cb-ebc58f43f458"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["4524e227-595e-4066-a3cb-ebc58f43f458"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":467.5}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"INSERTED DIF","revisionIds":["ec9659df-b7c0-4db5-87d9-2e5ea148a54b"]},{"text":"F","revisionIds":["ec9659df-b7c0-4db5-87d9-2e5ea148a54b"]},{"text":" ","revisionIds":["ec9659df-b7c0-4db5-87d9-2e5ea148a54b"]},{"text":"Inserted-AUTHOR","revisionIds":["ec9659df-b7c0-4db5-87d9-2e5ea148a54b"]}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["cd5f3f9c-4b16-487e-8261-624105dfdb65"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["cd5f3f9c-4b16-487e-8261-624105dfdb65"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["cd5f3f9c-4b16-487e-8261-624105dfdb65"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["86938887-e249-4b23-a015-908b4300ab11"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["86938887-e249-4b23-a015-908b4300ab11"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["86938887-e249-4b23-a015-908b4300ab11"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["8ac70e69-4736-43d6-88a8-357b4874c96a"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["8ac70e69-4736-43d6-88a8-357b4874c96a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["8ac70e69-4736-43d6-88a8-357b4874c96a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["a157be08-64aa-466d-afcc-4a01e49be8f4"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["a157be08-64aa-466d-afcc-4a01e49be8f4"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["a157be08-64aa-466d-afcc-4a01e49be8f4"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]},{"inlines":[{"text":"DELETED DIFF- AUTHOR","revisionIds":["ca507c75-8a4e-40de-a010-35eaf54539ad"]}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["d3020fc1-a212-4efb-823a-4063c67b149a"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["d3020fc1-a212-4efb-823a-4063c67b149a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["d3020fc1-a212-4efb-823a-4063c67b149a"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["4e96792a-bf92-4319-8fe6-c41dde6d1714"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["4e96792a-bf92-4319-8fe6-c41dde6d1714"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["4e96792a-bf92-4319-8fe6-c41dde6d1714"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["2b12de05-0dfb-468f-b14c-c8f174fc3145"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["2b12de05-0dfb-468f-b14c-c8f174fc3145"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["2b12de05-0dfb-468f-b14c-c8f174fc3145"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]},{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":0.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"revisionIds":["67141e1e-7547-4c37-97ab-ffb5abf65a2f"]},"cells":[{"blocks":[{"characterFormat":{"revisionIds":["67141e1e-7547-4c37-97ab-ffb5abf65a2f"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}},{"blocks":[{"characterFormat":{"revisionIds":["67141e1e-7547-4c37-97ab-ffb5abf65a2f"]},"inlines":[]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":233.75,"preferredWidthType":"Point","verticalAlignment":"Top","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"cellWidth":233.75}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false,"color":"#000000FF"},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false,"horizontalPositionAbs":"Left","horizontalPosition":0.0}},{"inlines":[]}],"headersFooters":{},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false,"restartPageNumbering":false,"pageStartingNumber":0,"endnoteNumberFormat":"LowerCaseRoman","footNoteNumberFormat":"Arabic","restartIndexForFootnotes":"DoNotRestart","restartIndexForEndnotes":"DoNotRestart","columns":{"column":[{"width":468.0,"space":36.0}],"numberOfColumns":1,"equalWidth":true}}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Arial"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"Revision","next":"Revision","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","link":"Header Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","link":"Footer Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font"}],"revisions":[{"author":"Kavitha Muralitharan","date":"2022-05-30T12:15:00Z","revisionType":"Insertion","revisionId":"8f193753-3819-4eb5-b60f-789b164678a5"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"0e421e9a-dd66-4ddc-89ad-f6549f6df3ab"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:15:00Z","revisionType":"Insertion","revisionId":"596b25e7-24e8-4f9a-9267-9daa2114acb9"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"b3b82750-1c5c-4fc3-b767-ce4ab3030ef8"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:11:00Z","revisionType":"Insertion","revisionId":"173c4d9c-6bde-4c57-88d0-d141da01ec48"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:17:00Z","revisionType":"Insertion","revisionId":"092287c0-213f-4524-9f13-7ceae6cbe912"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:12:00Z","revisionType":"Insertion","revisionId":"aa92a419-bb06-45a8-b64d-4123732883f8"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:17:00Z","revisionType":"Insertion","revisionId":"14aa004c-bd73-4816-ab39-bdedc27a5b08"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:18:00Z","revisionType":"Insertion","revisionId":"7dedb6bf-9aea-43d5-b1cf-8302987e6fd8"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:17:00Z","revisionType":"Insertion","revisionId":"73a988a5-9490-4985-8965-03786d04a100"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:18:00Z","revisionType":"Deletion","revisionId":"67463305-df3c-4aec-9a93-4e24e225e750"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:18:00Z","revisionType":"Insertion","revisionId":"cf8fec77-25b4-46ae-ab9b-26f94eadbd41"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:18:00Z","revisionType":"Deletion","revisionId":"4524e227-595e-4066-a3cb-ebc58f43f458"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:21:00Z","revisionType":"Insertion","revisionId":"ec9659df-b7c0-4db5-87d9-2e5ea148a54b"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:21:00Z","revisionType":"Insertion","revisionId":"cd5f3f9c-4b16-487e-8261-624105dfdb65"},{"author":"Kavi","date":"2022-05-30T12:21:00Z","revisionType":"Insertion","revisionId":"8ac70e69-4736-43d6-88a8-357b4874c96a"},{"author":"Kavi","date":"2022-05-30T12:22:00Z","revisionType":"Insertion","revisionId":"ca507c75-8a4e-40de-a010-35eaf54539ad"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:23:00Z","revisionType":"Deletion","revisionId":"d3020fc1-a212-4efb-823a-4063c67b149a"},{"author":"Kavi","date":"2022-05-30T12:23:00Z","revisionType":"Deletion","revisionId":"2b12de05-0dfb-468f-b14c-c8f174fc3145"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:08:00Z","revisionType":"Insertion","revisionId":"346219d4-0ca5-4e07-b355-8350e8ddb936"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:08:00Z","revisionType":"Insertion","revisionId":"f7d2a3dd-276f-454e-a804-23be10dad9af"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"f52a1eb6-f581-432f-ae62-6f4cf6ac4d80"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"2583be89-ce5c-4da7-a777-977f7f14febb"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"26379fb6-f47d-4e94-8a86-76e5b2a6fd8d"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:10:00Z","revisionType":"Deletion","revisionId":"02bc615b-af9e-4cb4-8f2e-80077136440c"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:11:00Z","revisionType":"Insertion","revisionId":"e5d13b14-693e-49b9-95d5-f1ca82c54435"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:12:00Z","revisionType":"Insertion","revisionId":"db8fc782-ef0b-429c-8893-3f4a902f2650"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:17:00Z","revisionType":"Insertion","revisionId":"5a9d6596-6964-42e1-b662-3934d26d3d8a"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:17:00Z","revisionType":"Insertion","revisionId":"cf321c1f-e691-4fcf-b46a-78a2dafe0a5f"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:21:00Z","revisionType":"Insertion","revisionId":"86938887-e249-4b23-a015-908b4300ab11"},{"author":"Kavi","date":"2022-05-30T12:21:00Z","revisionType":"Insertion","revisionId":"a157be08-64aa-466d-afcc-4a01e49be8f4"},{"author":"Kavitha Muralitharan","date":"2022-05-30T12:23:00Z","revisionType":"Deletion","revisionId":"4e96792a-bf92-4319-8fe6-c41dde6d1714"},{"author":"Kavi","date":"2022-05-30T12:23:00Z","revisionType":"Deletion","revisionId":"67141e1e-7547-4c37-97ab-ffb5abf65a2f"}],"defaultTabWidth":36.0,"formatting":false,"trackChanges":true,"protectionType":"NoProtection","enforcement":false,"dontUseHTMLParagraphAutoSpacing":false,"alignTablesRowByRow":false,"formFieldShading":true,"footnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple"},"inlines":[{"text":"\\u0004"}]}],"continuationNotice":[{"inlines":[]}]},"compatibilityMode":"Word2013"}'
describe('Track changes', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Enabling Tracking Changes And adding text', function () {
        console.log('Enabling Tracking Changes And adding text');
        container.currentUser = "vijay";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Enabling Track Changes and adding the text of two users consecutively', function () {
        console.log('Enabling Track Changes and adding the text of two users consecutively');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("Hello");
        container.editor.insertText("world");
        container.currentUser = "bhupathi";
        container.editor.insertText("I am Jack");
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Enabling Track Changes and adding the text of a new user between the existing test', function () {
        console.log('Enabling Track Changes and adding the text of a new user between the existing test');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("Hello");
        container.editor.insertText("world");
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.currentUser = "bhupathi";
        container.editor.insertText("I am Jack");
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Enabling Track Changes and adding Hyperlink', function () {
        console.log('Enabling Track Changes and adding Hyperlink');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertHyperlink("www.google.com");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Enabling Track Changes and adding Hyperlink with Original Text', function () {
        console.log('Enabling Track Changes and adding Hyperlink with Original Text');
        container.openBlank();
        container.currentUser = "vijay";
        container.editor.insertText("catch this link :");
        container.enableTrackChanges = true;
        container.editor.insertHyperlink("www.google.com");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Enabling Track Changes and adding Hyperlink with Original Link', function () {
        console.log('Enabling Track Changes and adding Hyperlink with Original Link');
        container.openBlank();
        container.currentUser = "vijay";
        container.editor.insertHyperlink("www.google.com");
        container.enableTrackChanges = true;
        container.editor.insertHyperlink("www.google.com");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding Hyperlink of different users', function () {
        console.log('Adding Hyperlink of different users');
        container.openBlank();
        container.currentUser = "vijay";
        container.enableTrackChanges = true;
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.editor.insertHyperlink("www.yahoo.com", "yahoo!");
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Adding text in a hyperlink display text by another user', function () {
        console.log('Adding text in a hyperlink display text by another user');
        container.openBlank();
        container.currentUser = "vijay";
        container.enableTrackChanges = true;
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.editor.insertHyperlink("www.yahoo.com", "yahoo!");
        container.selection.moveToLineStart();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.editor.insertText("oooo");
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Adding picture to the Document Enabling Track Changes', function () {
        console.log('Adding picture to the Document Enabling Track Changes');
        container.openBlank();
        container.currentUser = "vijay";
        container.enableTrackChanges = true;
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding picture to the Document after original text', function () {
        console.log('Adding picture to the Document after original text');
        container.openBlank();
        container.currentUser = "vijay";
        container.editor.insertText("This is my car");
        container.enableTrackChanges = true;
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding picture to the Document, Enabling Track Changes', function () {
        console.log('Adding picture to the Document, Enabling Track Changes');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("This is my car");
        container.currentUser = "Bhupathi";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Adding picture and text of same user', function () {
        console.log('Adding picture and text of same user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.editor.insertText("this is my car");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding paragraph mark for a simple test case', function () {
        console.log('Adding paragraph mark for a simple test case');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText(" This is the age of science and technology...Daily Science journals carry news of new discoveries and inventions. A discovery is finding something new. From the manufacture of a safety pin to a space rocket, Science and Technology played a major role. Man's labor has been simplified, his comforts have increased and he is now armed with powers by such scientific inventions.");
        container.editor.handleEnterKey();
        container.editor.insertText("this is an essay about modern science");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Handling a enter key between the paragraph', function () {
        console.log('Handling a enter key between the paragraph');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText(" This is the age of science and technology...Daily Science journals carry news of new discoveries and inventions. A discovery is finding something new. From the manufacture of a safety pin to a space rocket, Science and Technology played a major role. Man's labor has been simplified, his comforts have increased and he is now armed with powers by such scientific inventions.");
        container.editor.handleEnterKey();
        container.editor.insertText("this is an essay about modern science");
        container.selection.moveToParagraphStart();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.currentUser = "bhupathi";
        container.editor.handleEnterKey();
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Handling a enter key between the paragraph', function () {
        console.log('Handling a enter key between the paragraph');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText(" This is the age of science and technology...Daily Science journals carry news of new discoveries and inventions. A discovery is finding something new. From the manufacture of a safety pin to a space rocket, Science and Technology played a major role. Man's labor has been simplified, his comforts have increased and he is now armed with powers by such scientific inventions.");
        container.editor.handleEnterKey();
        container.editor.insertText("this is an essay about modern science");
        container.selection.moveToParagraphStart();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.editor.handleEnterKey();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding the heading in the header pane,Enabling Track Changes', function () {
        console.log('Adding the heading in the header pane,Enabling Track Changes');
        container.openBlank();
        container.enableTrackChanges = false;
        container.selection.goToHeader();
        container.editor.insertText("Heading");
        container.enableTrackChanges = true;
        container.currentUser = "bhupathi";
        container.editor.insertText("must");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding the heading of two different users,Enabling Track Changes', function () {
        console.log('Adding the heading of two different users,Enabling Track Changes');
        container.openBlank();
        container.selection.goToHeader();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("Heading");
        container.currentUser = "bhupathi";
        container.editor.insertText("must");
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Adding the heading of two different users,Enabling Track Changes', function () {
        console.log('Adding the heading of two different users,Enabling Track Changes');
        container.openBlank();
        container.selection.goToHeader();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("Heading");
        container.currentUser = "bhupathi";
        container.editor.insertText("must");
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Enabling the track changes and add footer', function () {
        console.log('Enabling the track changes and add footer');
        container.openBlank();
        container.selection.goToFooter();
        container.enableTrackChanges = true;
        container.editor.insertText("Disclaimer");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Add footer content of two different users', function () {
        console.log('Add footer content of two different users');
        container.openBlank();
        container.enableTrackChanges = true;
        container.selection.goToFooter();
        container.currentUser = "vijay";
        container.editor.insertText("Disclaimer");
        container.currentUser = "bhupathi";
        container.editor.insertText("Must");
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Add footer content between the content of existing user', function () {
        console.log('Add footer content between the content of existing user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.selection.goToFooter();
        container.currentUser = "vijay";
        container.editor.insertText("Disclaimer");
        container.currentUser = "bhupathi";
        container.selection.moveToLineStart();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.selection.moveToNextCharacter();
        container.editor.insertText("Must");
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Adding text, hyperlink,imagesby a single user', function () {
        console.log('Adding text, hyperlink,imagesby a single user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("Checking");
        container.editor.insertHyperlink("www.google.com", "Google");
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding text, hyperlink,imagesby a different  users', function () {
        console.log('Adding text, hyperlink,imagesby a different  users');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("Checking");
        container.currentUser = "bhupathi";
        container.editor.insertHyperlink("www.google.com", "Google");
        container.currentUser = "Veluswami";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Adding a row enabling track changes', function () {
        console.log('Adding a row enabling track changes');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(1, 1);
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding two rows and 5 columns', function () {
        console.log('Adding two rows and 5 columns');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(2, 5);
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Adding a row and text, enabling track changes by single user', function () {
        console.log('Adding a row and text, enabling track changes by single user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(1, 1);
        container.editor.insertText("hello");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding a row and hyperlink, enabling track changes by single user', function () {
        console.log('Adding a row and hyperlink, enabling track changes by single user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(1, 1);
        container.editor.insertHyperlink("www.google.com", "google");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Adding a 1*3 table by a user and text by another user ', function () {
        console.log('Adding a 1*3 table by a user and text by another user ');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(1, 3);
        container.currentUser = "bhupathi";
        container.editor.insertText("hello");
        container.selection.handleTabKey(true, false);
        container.editor.insertText("hello");
        container.selection.handleTabKey(true, false);
        container.editor.insertText("hello");
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Adding the 1*3 table by a user and handling tab key by user', function () {
        console.log('Adding the 1*3 table by a user and handling tab key by user');
        container.openBlank();
        container.currentUser = "vijay";
        container.enableTrackChanges = true;
        container.editor.createTable(1, 3);
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Adding the 1*3 table by a user and handling tab key by  other user', function () {
        console.log('Adding the 1*3 table by a user and handling tab key by  other user');
        container.openBlank();
        container.currentUser = "vijay";
        container.enableTrackChanges = true;
        container.editor.createTable(1, 3);
        container.currentUser = "bhupathi";
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        container.selection.handleTabKey(true, false);
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('Deleting the Original text', function () {
        console.log('Deleting the Original text');
        container.openBlank();
        container.editor.insertText("hello");
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Adding and deleting text by same user', function () {
        console.log('Adding and deleting text by same user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Adding and deleting text by select all and delete and accept', function () {
        console.log('Adding and deleting text by select all and delete and accept');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.length).toBe(0);
    });
    it('Adding and deleting text by select all and delete and reject', function () {
        console.log('Adding and deleting text by select all and delete and reject');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.editor.onEnter();
        container.editor.insertText("hello");
        container.selection.selectAll();
        container.editor.delete();
        expect(container.revisions.length).toBe(0);
    });
    it('Adding text by one user and delete by another user', function () {
        console.log('Adding text by one user and delete by another user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.currentUser = "Bhupathi";
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Deleting the middle text of a user by another user', function () {
        console.log('Deleting the middle text of a user by another user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.currentUser = "Bhupathi";
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Deleting The original hyperlink', function () {
        console.log('Deleting The original hyperlink');
        container.openBlank();
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.enableTrackChanges = true;
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Deleting the hyperlink of the user by another user', function () {
        console.log('Deleting the hyperlink of the user by another user');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "Vijay";
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Deleting the existing hyperlink and add a new hyperlink', function () {
        console.log('Deleting the existing hyperlink and add a new hyperlink');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "Vijay";
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        container.editor.insertHyperlink("www.yahoo.com", "Yahoo");
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Deleting a original picture by enabling track changes ', function () {
        console.log('Deleting a original picture by enabling track changes ');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Deleting a picture of a user by another user ', function () {
        console.log('Deleting a picture of a user by another user ');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "Bhupathi";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.currentUser = "vijay";
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Deleting a multiple author table without track change from downward', function () {
        console.log('Deleting a multiple author table without track change from downward');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(5, 2);
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleShiftUpKey();
        container.enableTrackChanges = false;
        container.currentUser = "arun";
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
    });
    it('Deleting a multiple author table without track change from downward and undo', function () {
        console.log('Deleting a multiple author table without track change from downward and undo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(5, 2);
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.editor.insertHyperlink("www.google.com", "google");
        container.selection.handleDownKey();
        container.selection.handleShiftUpKey();
        container.enableTrackChanges = false;
        container.currentUser = "arun";
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(5);
    });
    it('Deleting a multiple author table with track change from downward and undo', function () {
        console.log('Deleting a multiple author table with track change from downward and undo');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertTable(5, 2);
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleDownKey();
        container.selection.handleShiftUpKey();
        container.selection.handleShiftUpKey();
        container.currentUser = "arun";
        container.editor.delete();
        var count = container.revisions.changes.length;
        expect(count).toBe(7);
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(5);
    });
    it('Comment tab removed in review pane when track change is enabled', function () {
        console.log('Comment tab removed in review pane when track change is enabled');
        container.enableComment = false;
        container.documentHelper.showRevisions(true);
        let hide: any = container.commentReviewPane.reviewTab;
        let commentTab: string = hide.tbItem[0].classList[2];
        expect(commentTab).toBe('e-hidden');
    });
    it('Reject for movefrom and move to', function () {
        console.log('Reject for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).reject();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Accept for movefrom and move to', function () {
        console.log('Accept for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Accept and reject for movefrom and move to', function () {
        console.log('Accept and reject for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Accept and reject for movefrom and move to', function () {
        console.log('Accept and reject for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Accept for movefrom and move to', function () {
        console.log('Accept for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Accept and Reject for movefrom and move to', function () {
        console.log('Accept and Reject for movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Accept all movefrom and move to', function () {
        console.log('Accept all movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.acceptAll();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Accept all movefrom and move to', function () {
        console.log('Accept all movefrom and move to');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.rejectAll();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('Accept all movefrom and move to and redoing', function () {
        console.log('Accept all movefrom and move to and redoing');
        container.openBlank();
        container.open(text);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.acceptAll();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.redo();
        container.editorHistory.redo();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Accept all movefrom and move to,insertion and deletion and redoing', function () {
        console.log('Accept all movefrom and move to,insertion and deletion and redoing');
        container.openBlank();
        container.open(sentence);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.acceptAll();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.redo();
        container.editorHistory.redo();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Text revisions reject history preservation UNDO', () => {
        console.log('Text revisions reject history preservation UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.editor.insertText("hello");
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Text revisions history preservation UNDO', () => {
        console.log('Text revisions history preservation UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "bhupathi";
        container.editor.insertText("hello");
        container.currentUser = "vijay";
        container.editor.insertText("Hi");
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('History for links,UNDO', () => {
        console.log('History for links,UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertHyperlink("www.google.com", "Google");
        container.currentUser = "Bhupathi";
        container.editor.insertHyperlink("www.yahoo.com", "yahoo");
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('History for images, UNDO', () => {
        console.log('History for images, UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.currentUser = "bhupathi";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.currentUser = "bhupathi";
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(2);
    });
    it('History for text image and hyperlink,UNDO', () => {
        console.log('History for text image and hyperlink,UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "bhupathi";
        container.editor.insertText("hello")
        container.currentUser = "vijay";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.currentUser = "Chandru";
        container.editor.insertHyperlink("www.google.com", "google");
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        var e = container.revisions.get(0);
        var f = container.selection.selectRevision(e);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('History for text image and hyperlink,UNDO', () => {
        console.log('History for text image and hyperlink,UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "bhupathi";
        container.editor.insertText("hello")
        container.currentUser = "vijay";
        container.editor.insertImage("data:image/jpeg;base64,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", 213, 132.75);
        container.currentUser = "Chandru";
        container.editor.insertHyperlink("www.google.com", "google");
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).reject();
        var e = container.revisions.get(0);
        var f = container.selection.selectRevision(e);
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    it('original text and delete revision,UNDO', () => {
        console.log('original text and delete revision,UNDO');
        container.openBlank();
        container.enableTrackChanges = false;
        container.editor.insertText("hello");
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        var count: number = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('history preservation for two user,redo', () => {
        console.log('history preservation for two user,redo');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = true;
        container.currentUser = "vijay";
        container.editor.insertText("hello");
        container.currentUser = "Bhupathi";
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.moveToPreviousCharacter();
        container.selection.handleShiftLeftKey();
        container.editor.delete();
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).accept();
        var c = container.revisions.get(0);
        var d = container.selection.selectRevision(c);
        container.revisions.get(0).accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.redo();
        container.editorHistory.redo();
        var count = container.revisions.changes.length;
        expect(count).toBe(0);
    });
    it('Deleting a original hyperlink,redo', () => {
        console.log('Deleting a original hyperlink,redo');
        container.openBlank();
        container.enableTrackChanges = false;
        container.enableTrackChanges = false;
        container.editor.insertHyperlink("www.google.com", "google");
        container.currentUser = "bhupathi";
        container.enableTrackChanges = true;
        container.selection.handleControlShiftLeftKey();
        container.editor.delete();
        var a = container.revisions.get(0);
        var b = container.selection.selectRevision(a);
        container.revisions.get(0).reject();
        container.editorHistory.undo();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
    it('Undo / Redo for table row deleted with contents', function () {
        console.log('Undo / Redo for table row deleted with contents');
        container.openBlank();
        container.enableTrackChanges = true;
        container.currentUser = "Guest User";
        container.editor.insertTable(2, 2);
        container.enableTrackChanges = false;
        container.editor.insertText('Hello world ');
        container.currentUser = "other User";
        container.enableTrackChanges = true;
        container.editor.insertText('Welcome');
        container.selection.handleRightKey()
        container.editor.insertText('Cell2');
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.selection.handleShiftLeftKey();
        container.editor.onBackSpace();
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
        expect(() => { container.editorHistory.undo(); }).not.toThrowError();
        expect((container.selection.start.paragraph.associatedCell.ownerRow).childWidgets.length).toBe(2);
        var count = container.revisions.changes.length;
        expect(count).toBe(4);
        expect(() => { container.editorHistory.redo(); }).not.toThrowError();
        expect((container.selection.start.paragraph.associatedCell.ownerRow).childWidgets.length).toBe(2);
        var count = container.revisions.changes.length;
        expect(count).toBe(3);
    });
    // it('Remove review pane when track change is disabled', function () {
    //     console.log('Remove review pane when track change is disabled');
    //     container.openBlank();
    //     container.currentUser = "vijay";
    //     container.editor.insertText("Hello");
    //     container.enableTrackChanges = true;
    //     container.editor.insertText("world ");
    //     container.enableTrackChanges = false;
    //     container.editor.insertText("aa");
    //     container.selection.moveToPreviousCharacter();
    //     container.selection.moveToPreviousCharacter();
    //     container.selection.moveToPreviousCharacter();
    //     container.documentHelper.showRevisions(true);
    //     expect(container.showRevisions).toBe(false);
    // });

});
describe('Track changes Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Enabling Tracking Changes  And enabling Readonly mode', function () {
        console.log('Enabling Tracking Changes And enabling Readonly mode');
        container.currentUser = "Guest";
        container.editor.insertText("Hello");
        container.enableTrackChanges = true;
        container.editor.insertText("world");
        container.isReadOnly = true;
        container.revisions.acceptAll();
        var count = container.revisions.changes.length;
        expect(count).toBe(1);
    });
});
describe('Track changes Pane in RTL Validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track Changes Pane close button validation', function () {
        console.log('Track Changes Pane close button validation');
        let left: string = container.trackChangesPane.closeButton.style.left;
        let right: string = container.trackChangesPane.closeButton.style.right;
        expect(left).toBe('1px');
        expect(right).toBe('');
    });
});

describe('Track changes grouping', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track Changes table Revision Validation', function () {
        console.log('Track Changes table Revision Validation');
        container.open(table);
        container.enableTrackChanges = true;
        let tabCount : number = 0;
        if((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] instanceof TableWidget)) {
            tabCount = 1;
        } 
        expect(tabCount).toBe(1);
    });
    it('Track Changes Number of  Revision Validation', function () {
        console.log('Track Changes Number of  Revision Validation');
        container.open(table);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let revisionCount = container.revisions.changes.length;
        expect(revisionCount).toBe(7);
    });
    it('Track Changes deletion view Validation', function () {
        console.log('Track Changes deletion view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let revision = container.revisions.changes.length;
        for (let i: number = 0; i < revision; i++) {
            let revisionType1 =container.revisions.changes[0].revisionType;
            let revisionType2 =container.revisions.changes[1].revisionType;
        let delRow : number = 0;
        if( revisionType1 && revisionType2 === 'Deletion') {
            delRow = 1;
        } 
        expect(delRow).toBe(1);
    }
    });
    it('Track Changes insertion view Validation', function () {
        console.log('Track Changes insertion view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let revision = container.revisions.changes.length;
        for (let i: number = 0; i < revision; i++) {
            let revisionType1 =container.revisions.changes[2].revisionType;
            let revisionType2 =container.revisions.changes[3].revisionType;
        let inRow : number = 0;
        if( revisionType1 && revisionType2 === 'Insertion') {
            inRow = 1;
        } 
        expect(inRow).toBe(1);
    }
    });
    it('Track Changes thread view Validation', function () {
        console.log('Track Changes thread view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        let threadView = document.getElementsByClassName('e-de-tc-pane-revision');
        for (let j: number = 0; j < threadView.length; j++) {
            expect(threadView[j].getElementsByClassName('e-de-tc-outer').length).toBe(3);
        }
    });
    it('Track Changes table view Validation', function () {
        console.log('Track Changes table view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        let tableView = document.getElementsByClassName('e-de-tc-outer');
        for (let j: number = 0; j < tableView.length; j++) {
            expect(tableView[0].getElementsByClassName('e-de-track-chng-table').length).toBe(1);
        }
    });
    it('Track Changes row view Validation', function () {
        console.log('Track Changes row view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        let rowView = document.getElementsByClassName('e-de-tc-outer');
        for (let j: number = 0; j < rowView.length; j++) {
            expect(rowView[2].getElementsByClassName('e-de-track-chng-table')[0].childNodes[0].childNodes.length).toBe(3);
        }
    });
    it('Track Changes cell view Validation', function () {
        console.log('Track Changes cell view Validation');
        container.open(table);
        container.enableTrackChanges = true;
        let cellView = document.getElementsByClassName('e-de-tc-outer');
        for (let j: number = 0; j < cellView.length; j++) {
            expect(cellView[1].getElementsByClassName('e-de-track-chng-table')[0].getElementsByClassName('e-de-tc-tble-cell').length).toBe(4);
        }
    });
});
describe('Navigation Grouping', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track Changes group navigation next Validation', function (done) {
        console.log('Track Changes group navigation next Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.trackChangesPane.navigateNextChanges();
            container.trackChangesPane.navigateNextChanges();
            let startSelect = container.selection.startOffset;
            let endSelect = container.selection.endOffset;
            expect(startSelect).toBe('0;4;0;0;0;0');
            expect(endSelect).toBe('0;4;1;2;0;1');
            done();
        }, 1000);
    });
    it('Track Changes group navigation previous Validation', function (done) {
        console.log('Track Changes group navigation previous Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.trackChangesPane.navigatePreviousChanges();
            let startSelect = container.selection.startOffset;
            let endSelect = container.selection.endOffset;
            expect(startSelect).toBe('0;21;2;0;0;0');
            expect(endSelect).toBe('0;21;3;1;0;1');
            done();
        }, 1000);
    });
});
describe('Track changes in Header validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track changes in Header validationn', function () {
        container.openBlank();
        container.selection.goToHeader();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        container.revisions.changes[0].accept();
        let para: ParagraphWidget = container.documentHelper.pages[0].headerWidget.childWidgets[0] as ParagraphWidget;
        expect((para.childWidgets[0] as LineWidget).children[0].revisions.length).toBe(0);
        expect((para.childWidgets[0] as LineWidget).children[0].removedIds.length).toBe(0);
        para = (container.documentHelper.headersFooters[0][0] as HeaderFooterWidget).childWidgets[0] as ParagraphWidget;
        expect((para.childWidgets[0] as LineWidget).children[0].revisions.length).toBe(0);
        expect((para.childWidgets[0] as LineWidget).children[0].removedIds.length).toBe(0);
    });
    it('Open document with tracked changes in header', function () {
        container.openBlank();
        container.selection.goToHeader();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        let sfdtContent = container.serialize();
        container.openBlank();
        expect(container.revisions.length).toBe(0);
        container.open(sfdtContent);
        expect(container.revisions.length).toBe(1);
        expect(() => { container.revisions.changes[0].accept() }).not.toThrowError();
    });
    it('Open document with tracked changes in footer', function () {
        container.openBlank();
        container.selection.goToFooter();
        container.enableTrackChanges = true;
        container.editor.insertText("Hello");
        let sfdtContent = container.serialize();
        container.openBlank();
        expect(container.revisions.length).toBe(0);
        container.open(sfdtContent);
        expect(container.revisions.length).toBe(1);
        expect(() => { container.revisions.changes[0].accept() }).not.toThrowError();
    });
});

describe('Track changes grouping for Accept and Reject', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Track Changes table Revisions Validation', function () {
        console.log('Track Changes table Revisions Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        let tabCount: number = 0;
        if ((container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] instanceof TableWidget)) {
            tabCount = 1;
        }
        expect(tabCount).toBe(1);
    });
    it('Track Changes Number of  Revisions Validation', function () {
        console.log('Track Changes Number of  Revisions Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let revisionCount = container.revisions.changes.length;
        expect(revisionCount).toBe(33);
    });
    it('Track Changes group Accept insertion Validation', function (done) {
        console.log('Track Changes group Accept insertion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[0].accept();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject insertion Validation', function (done) {
        console.log('Track Changes group Reject insertion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[0].reject();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Accept Deletion Validation', function (done) {
        console.log('Track Changes group Accept Deletion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[3].accept();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject Deletion Validation', function (done) {
        console.log('Track Changes group Reject Deletion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[3].reject();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Accept consecutive table Validation', function (done) {
        console.log('Track Changes group Accept consecutive table Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[14].accept();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject consecutive table Validation', function (done) {
        console.log('Track Changes group Reject consecutive table Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[15].accept();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(30);
            done();
        }, 1000);
    });
    it('Track Changes group Accept single table insertion  Validation', function (done) {
        console.log('Track Changes group Accept single table insertion  Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[10].accept();
            let insertionCount = container.revisions.changes.length;
            expect(insertionCount).toBe(31);
            done();
        }, 1000);
    });


    it('Track Changes group Accept single table  deletion Validation', function (done) {
        console.log('Track Changes group Accept single table  deletion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[6].accept();
            let deletionCount = container.revisions.changes.length;
            expect(deletionCount).toBe(29);
            done();
        }, 1000);
    });
    it('Track Changes group Reject single table insertion  Validation', function (done) {
        console.log('Track Changes group Reject single table insertion  Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[10].reject();
            let insertionCount = container.revisions.changes.length;
            expect(insertionCount).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject single table  deletion Validation', function (done) {
        console.log('Track Changes group Reject single table  deletion Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[6].reject();
            let deletionCount = container.revisions.changes.length;
            expect(deletionCount).toBe(29);
            done();
        }, 1000);
    });
    it('Accept  same table as different author', function (done) {
        console.log('Accept  same table as different author');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let authorName = container.revisions.changes[24].author;
            expect(authorName).toBe("Kavitha Muralitharan");
            container.revisions.changes[24].accept();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(31);
            done();
        }, 1000);
    });
    it('Reject  same table as different author', function (done) {
        console.log('Reject  same table as different author');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let authorName = container.revisions.changes[26].author;
            expect(authorName).toBe("Kavi");
            container.revisions.changes[26].accept();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(31);
            done();
        }, 1000);
    });
    it('Accpet  single row in a table validation', function (done) {
        console.log('Accpet  single row in a table validation');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let revisionType = container.revisions.changes[19].revisionType;
            expect(revisionType).toBe("Insertion");
            container.revisions.changes[19].accept();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(32);
            done();
        }, 1000);
    });
    it('Reject  single row in a table validation', function (done) {
        console.log('accpet  single row in a table validation');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let revisionType = container.revisions.changes[20].revisionType;
            expect(revisionType).toBe("Deletion");
            container.revisions.changes[20].accept();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(32);
            done();
        }, 1000);
    });

    //UNDO
    it('Track Changes group Accept insertion undo Validation', function () { //1
        console.log('Track Changes group Accept insertion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[0].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountAccept = container.revisions.changes.length;
        expect(revisionCountAccept).toBe(33);
    });
    it('Track Changes group Reject insertion undo Validation', function () { //2
        console.log('Track Changes group Reject insertion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[0].reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountReject = container.revisions.changes.length;
        expect(revisionCountReject).toBe(33);
    });
    it('Track Changes group Accept Deletion undo Validation', function () { //3
        console.log('Track Changes group Accept Deletion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[3].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountAccept = container.revisions.changes.length;
        expect(revisionCountAccept).toBe(33);
    });
    it('Track Changes group Reject Deletion  undo Validation', function () { //4
        console.log('Track Changes group Reject Deletion  undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[3].reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountReject = container.revisions.changes.length;
        expect(revisionCountReject).toBe(33);
    });
    it('Track Changes group Accept consecutive table undo Validation', function () { //5
        console.log('Track Changes group Accept consecutive table undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[15].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountAccept = container.revisions.changes.length;
        expect(revisionCountAccept).toBe(33);
    });
    it('Track Changes group Reject consecutive table undo Validation', function () { //6
        console.log('Track Changes group Reject consecutive table undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[15].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let revisionCountReject = container.revisions.changes.length;
        expect(revisionCountReject).toBe(33);
    });
    it('Track Changes group Accept single table insertion undo Validation', function () { //7
        console.log('Track Changes group Accept single table insertion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[10].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let insertionCount = container.revisions.changes.length;
        expect(insertionCount).toBe(33);
    });
    it('Track Changes group Accept single table  deletion undo Validation', function () { //8
        console.log('Track Changes group Accept single table  deletion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[6].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let deletionCount = container.revisions.changes.length;
        expect(deletionCount).toBe(33);
    });
    it('Track Changes group Reject single table insertion undo Validation', function () { //9
        console.log('Track Changes group Reject single table insertion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[10].reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let insertionCount = container.revisions.changes.length;
        expect(insertionCount).toBe(33);
    });
    it('Track Changes group Reject single table  deletion undo Validation', function () { //10
        console.log('Track Changes group Reject single table  deletion undo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.revisions.changes[6].reject();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let deletionCount = container.revisions.changes.length;
        expect(deletionCount).toBe(33);
    });
    it('Accept  same table as different author undo', () => { //11
        console.log('Accept  same table as different author undo');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let authorName = container.revisions.changes[24].author;
        expect(authorName).toBe("Kavitha Muralitharan");
        container.revisions.changes[24].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let reamainTableCount = container.revisions.changes.length;
        expect(reamainTableCount).toBe(33);
    });
    it('Reject  same table as different author  undo', () => { //12
        console.log('Reject  same table as different author undo');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        let authorName = container.revisions.changes[26].author;
        expect(authorName).toBe("Kavi");
        container.revisions.changes[26].accept();
        container.editorHistory.undo();
        container.editorHistory.undo();
        let reamainTableCount = container.revisions.changes.length;
        expect(reamainTableCount).toBe(33);
    });
    //REDO
    it('Track Changes group Accept insertion redo Validation', function (done) {
        console.log('Track Changes group Accept insertion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[0].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject insertion redo Validation', function (done) {
        console.log('Track Changes group Reject insertion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[0].reject();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Accept Deletion redo Validation', function (done) {
        console.log('Track Changes group Accept Deletion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[3].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject Deletion  redo Validation', function (done) {
        console.log('Track Changes group Reject Deletion  redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[3].reject();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Accept consecutive table redo Validation', function (done) {
        console.log('Track Changes group Accept consecutive table redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[15].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountAccept = container.revisions.changes.length;
            expect(revisionCountAccept).toBe(30);
            done();
        }, 1000);
    });
    it('Track Changes group Reject consecutive table redo Validation', function (done) {
        console.log('Track Changes group Reject consecutive table redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[15].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let revisionCountReject = container.revisions.changes.length;
            expect(revisionCountReject).toBe(30);
            done();
        }, 1000);
    });
    it('Track Changes group Accept single table insertion redo Validation', function (done) {
        console.log('Track Changes group Accept single table insertion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[10].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let insertionCount = container.revisions.changes.length;
            expect(insertionCount).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Accept single table  deletion redo Validation', function (done) {
        console.log('Track Changes group Accept single table  deletion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[6].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let deletionCount = container.revisions.changes.length;
            expect(deletionCount).toBe(29);
            done();
        }, 1000);
    });
    it('Track Changes group Reject single table insertion redo Validation', function (done) {
        console.log('Track Changes group Reject single table insertion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[10].reject();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let insertionCount = container.revisions.changes.length;
            expect(insertionCount).toBe(31);
            done();
        }, 1000);
    });
    it('Track Changes group Reject single table  deletion redo Validation', function (done) {
        console.log('Track Changes group Reject single table  deletion redo Validation');
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            container.revisions.changes[6].reject();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let deletionCount = container.revisions.changes.length;
            expect(deletionCount).toBe(29);
            done();
        }, 1000);
    });
    it('Accept  same table as different author redo', function (done) {
        console.log('Accept  same table as different author redo');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let authorName = container.revisions.changes[24].author;
            expect(authorName).toBe("Kavitha Muralitharan");
            container.revisions.changes[24].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(31);
            done();
        }, 1000);
    });
    it('Reject  same table as different author  redo', function (done) {
        console.log('Reject  same table as different author redo');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let authorName = container.revisions.changes[26].author;
            expect(authorName).toBe("Kavi");
            container.revisions.changes[26].accept();
            container.editorHistory.redo();
            container.editorHistory.redo();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(31);
            done();
        }, 1000);
    });
    it('Accpet  single row in a table redo validation', function (done) {
        console.log('Accpet  single row in a table redo validation');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let revisionType = container.revisions.changes[19].revisionType;
            expect(revisionType).toBe("Insertion");
            container.revisions.changes[19].accept();
            container.editorHistory.redo();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(32);
            done();
        }, 1000);
    });
    it('Reject  single row in a table redo validation', function (done) {
        console.log('accpet  single row in a table redo validation');
        container.enableTrackChanges = true;
        container.openBlank();
        container.open(tableGroup);
        container.enableTrackChanges = true;
        container.showRevisions = true;
        setTimeout(() => {
            let revisionType = container.revisions.changes[20].revisionType;
            expect(revisionType).toBe("Deletion");
            container.revisions.changes[20].accept();
            container.editorHistory.redo();
            let reamainTableCount = container.revisions.changes.length;
            expect(reamainTableCount).toBe(32);
            done();
        }, 1000);
    });
});
describe('Track changes in Table validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Delete Table validation when Track Changes is enabled', () => {
        console.log('Delete Table validation when Track Changes is enabled');
        container.enableTrackChanges = true;
        container.currentUser = "Guest User";
        container.editor.insertTable(2, 2);
        container.selection.moveToDocumentStart();
        container.editor.deleteTable();
        let flag : number = 0;
        if(!(container.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] instanceof TableWidget)) {
            flag = 1;
        } 
        expect(flag).not.toBe(0);
    });

});

describe('Track changes pane button enable disable validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Enable disable validation in ready only protection', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.editor.insertText("Hello World");
        for (let i = 0; i < 3; i++) {
            container.editor.addProtection('', 'ReadOnly');
            let accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            let rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(true);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(true);

            container.editor.unProtectDocument();
            accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(false);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(false);
        }
    });
    it('Enable disable validation in form fields only protection', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.editor.insertText("Hello World");
        for (let i = 0; i < 3; i++) {
            container.editor.addProtection('', 'FormFieldsOnly');
            let accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            let rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(true);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(true);

            container.editor.unProtectDocument();
            accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(false);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(false);
        }
    });

    it('Enable disable validation in comments only protection', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.editor.insertText("Hello World");
        for (let i = 0; i < 3; i++) {
            container.editor.addProtection('', 'CommentsOnly');
            let accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            let rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(true);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(true);

            container.editor.unProtectDocument();
            accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(false);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(false);
        }
    });

    it('Enable disable validation in tracked changes only protection', () => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.editor.insertText("Hello World");
        for (let i = 0; i < 3; i++) {
            container.editor.addProtection('', 'RevisionsOnly');
            let accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            let rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(true);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(true);

            container.editor.unProtectDocument();
            accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(false);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(false);
        }
    });

    it('Enable disable validation whie opening new document', (done) => {
        container.openBlank();
        container.enableTrackChanges = true;
        container.showRevisions = true;
        container.editor.insertText("Hello World");
        container.editor.addProtection('', 'FormFieldsOnly');
        let sfdt=  container.serialize();
        container.openBlank();
        container.open(sfdt);
       
        setTimeout(() => {
            let accpetButton = document.getElementsByClassName('e-de-track-accept-button')[0];
            let rejectButton = document.getElementsByClassName('e-de-track-reject-button')[0];
            expect(accpetButton.classList.contains('e-de-overlay')).toBe(true);
            expect(rejectButton.classList.contains('e-de-overlay')).toBe(true);
            done()
        }, 200);
    });

});
let track: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false,"pageNumberStyle":"Arabic"},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"Fghjkl"}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"revisionIds":["627a7426-91d5-41a1-b99c-4ec1adf0f979"]},"inlines":[]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"revisionIds":["627a7426-91d5-41a1-b99c-4ec1adf0f979"]},"inlines":[{"characterFormat":{},"text":"Frgthjkjhfgh","revisionIds":["627a7426-91d5-41a1-b99c-4ec1adf0f979"]}]},{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"fghjkjhgh"}]}],"headersFooters":{}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#00000000","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false,"keepLinesTogether":false,"keepWithNext":false,"widowControl":true},"defaultTabWidth":36,"trackChanges":true,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"compatibilityMode":"Word2013","styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[{"author":"Balamurugan Shanmugam","date":"2022-06-02T22:26:00Z","revisionType":"Deletion","revisionId":"627a7426-91d5-41a1-b99c-4ec1adf0f979"}],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{},"inlines":[{"characterFormat":{},"text":"\u0004"}]}]}};
describe('Empty Para with delete revisions validations', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory , SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true, enableRtl: true });
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
    it("Track change accept all validation in delete Revision",()=>{
        editor.open(track);
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(4);
        expect(editor.revisions.changes[0].range.length).toBe(3);
        editor.revisions.acceptAll();
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(2);
        expect(editor.revisions.changes[0]).toBe(undefined);
    });
});